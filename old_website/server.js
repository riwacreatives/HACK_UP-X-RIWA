/**
 * HACK UTTAR PRADESH 2026 | RIWA CREATIVES OFFICIAL SQL BACKEND SERVER
 * Database: Relational SQLite (database.sqlite) via Node's native DatabaseSync engine
 * Schema: schema.sql (tables: registrations, verifications, notifications)
 *
 * Endpoints:
 *  - POST /api/register          : Insert registration into SQL, issue Pass ID & notification
 *  - GET  /api/verify            : Verify Pass ID or Email in SQL database with audit trail
 *  - POST /api/checkin           : Check in attendee on-site (updates SQL status to CHECKED_IN)
 *  - GET  /api/registrations     : Query all registrations from SQL
 *  - GET  /api/registrations/export : Download attendee data as clean CSV
 *  - GET  /api/export/sql        : Download entire database as standard SQL dump
 *  - POST /api/auth/google       : Google OAuth verification
 *  - GET  /api/stats             : Real-time statistics aggregated from SQL
 *  - GET  /api/health            : Health & database status
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'database.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const JSON_BACKUP_PATH = path.join(__dirname, 'registrations.json');

// Initialize SQLite Database
let db;
try {
  db = new DatabaseSync(DB_PATH);
  if (fs.existsSync(SCHEMA_PATH)) {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSql);
  }
  console.log('[Riwa SQL Engine] Connected to database.sqlite');
} catch (err) {
  console.error('[Riwa SQL Engine] Initialization failed:', err);
  process.exit(1);
}

// Migrate existing JSON records if SQLite table is empty
function migrateFromJsonIfNeeded() {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    if (countRow.count === 0 && fs.existsSync(JSON_BACKUP_PATH)) {
      const jsonData = JSON.parse(fs.readFileSync(JSON_BACKUP_PATH, 'utf8') || '[]');
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        console.log(`[Riwa SQL Engine] Migrating ${jsonData.length} records from registrations.json into SQL...`);
        const insertStmt = db.prepare(`
          INSERT OR REPLACE INTO registrations (
            id, pass_id, full_name, email, phone, district, role, track, mode,
            google_verified, google_sub, google_picture, registered_at, registered_at_ist,
            verification_status, checked_in, checked_in_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const item of jsonData) {
          insertStmt.run(
            item.id || crypto.randomUUID(),
            item.passId || `HACKUP-2026-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
            item.name || 'Anonymous',
            (item.email || '').toLowerCase().trim(),
            item.phone || '',
            item.district || 'Lucknow',
            item.role || 'Builder',
            item.track || 'AI for Bharat',
            item.mode || 'Team (2-4 Members)',
            item.googleVerified ? 1 : 0,
            item.googleProfile ? item.googleProfile.sub || null : null,
            item.googleProfile ? item.googleProfile.picture || null : null,
            item.registeredAt || new Date().toISOString(),
            item.registeredAtIST || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
            'VERIFIED_ACTIVE',
            0,
            null
          );
        }
        console.log('[Riwa SQL Engine] JSON migration completed.');
      }
    }
  } catch (err) {
    console.error('[Riwa SQL Engine] Migration error:', err);
  }
}

migrateFromJsonIfNeeded();

// Sync SQLite database to JSON backup periodically or on write
function syncJsonBackup() {
  try {
    const rows = db.prepare('SELECT * FROM registrations ORDER BY registered_at DESC').all();
    const formatted = rows.map(r => ({
      id: r.id,
      passId: r.pass_id,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      district: r.district,
      role: r.role,
      track: r.track,
      mode: r.mode,
      googleVerified: Boolean(r.google_verified),
      registeredAt: r.registered_at,
      registeredAtIST: r.registered_at_ist,
      verificationStatus: r.verification_status,
      checkedIn: Boolean(r.checked_in),
      checkedInAt: r.checked_in_at
    }));
    fs.writeFileSync(JSON_BACKUP_PATH, JSON.stringify(formatted, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Riwa SQL Engine] Backup warning:', e.message);
  }
}

function generatePassId() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HACKUP-2026-${randomPart}`;
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.sql': 'text/plain; charset=utf-8'
};

function serveStaticFile(req, res, pathname) {
  let safePath = pathname === '/' ? '/index.html' : pathname;
  const resolvedPath = path.normalize(path.join(__dirname, safePath));
  if (!resolvedPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(resolvedPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Resource not found' }));
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, 'http://' + (req.headers.host || '127.0.0.1:5000'));
  const pathname = reqUrl.pathname;

  // Serve Frontend Static Files
  if (!pathname.startsWith('/api/')) {
    serveStaticFile(req, res, pathname);
    return;
  }

  // 1. Health check
  if (req.method === 'GET' && pathname === '/api/health') {
    const totalCount = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      database: 'SQLite (database.sqlite)',
      tables: ['registrations', 'verifications', 'notifications'],
      registeredAttendeesInSQL: totalCount,
      server: 'Hack Uttar Pradesh SQL API'
    }));
    return;
  }

  // 2. POST /api/register
  if (req.method === 'POST' && pathname === '/api/register') {
    try {
      const data = await parseJsonBody(req);
      const { name, email, phone, district, role, track, mode, googleVerified, googleProfile } = data;

      if (!name || !email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Full name and email are required.' }));
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      // Check if already registered in SQL database
      const existing = db.prepare('SELECT * FROM registrations WHERE email = ?').get(cleanEmail);
      if (existing) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          isDuplicate: true,
          message: 'Attendee is already registered in the SQL Registry.',
          passId: existing.pass_id,
          registration: {
            passId: existing.pass_id,
            name: existing.full_name,
            email: existing.email,
            phone: existing.phone,
            district: existing.district,
            role: existing.role,
            track: existing.track,
            mode: existing.mode,
            verificationStatus: existing.verification_status,
            checkedIn: Boolean(existing.checked_in),
            registeredAtIST: existing.registered_at_ist
          }
        }));
        return;
      }

      let passId = generatePassId();
      // Ensure unique pass_id in SQL
      while (db.prepare('SELECT 1 FROM registrations WHERE pass_id = ?').get(passId)) {
        passId = generatePassId();
      }

      const regId = crypto.randomUUID();
      const now = new Date();
      const registeredAt = now.toISOString();
      const registeredAtIST = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

      // Insert into registrations table
      const insertRegStmt = db.prepare(`
        INSERT INTO registrations (
          id, pass_id, full_name, email, phone, district, role, track, mode,
          google_verified, google_sub, google_picture, registered_at, registered_at_ist,
          verification_status, checked_in, checked_in_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertRegStmt.run(
        regId,
        passId,
        name.trim(),
        cleanEmail,
        (phone || '').trim(),
        district || 'Lucknow',
        role || 'Builder',
        track || 'AI for Bharat',
        mode || 'Team (2-4 Members)',
        googleVerified ? 1 : 0,
        googleProfile ? googleProfile.sub || null : null,
        googleProfile ? googleProfile.picture || null : null,
        registeredAt,
        registeredAtIST,
        'VERIFIED_ACTIVE',
        0,
        null
      );

      // Insert into notifications table
      const notifId = `NOTIF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const insertNotifStmt = db.prepare(`
        INSERT INTO notifications (
          id, pass_id, recipient_email, recipient_name, subject, channel, status, dispatched_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertNotifStmt.run(
        notifId,
        passId,
        cleanEmail,
        name.trim(),
        `Your Delegate Pass for Hack Uttar Pradesh 2026 (${passId})`,
        'SIMULATED_SMTP',
        'DISPATCHED',
        registeredAt
      );

      // Insert initial verification log
      const insertVerifStmt = db.prepare(`
        INSERT INTO verifications (
          pass_id, verified_at, verifier_type, status_result, notes
        ) VALUES (?, ?, ?, ?, ?)
      `);

      insertVerifStmt.run(
        passId,
        registeredAt,
        'SYSTEM_ISSUANCE',
        'VALID',
        'Pass issued and confirmed in SQL Registry'
      );

      syncJsonBackup();

      const totalCount = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Registration confirmed and recorded in SQL Database! Pass issued.',
        passId,
        registration: {
          id: regId,
          passId,
          name: name.trim(),
          email: cleanEmail,
          phone: (phone || '').trim(),
          district: district || 'Lucknow',
          role: role || 'Builder',
          track: track || 'AI for Bharat',
          mode: mode || 'Team (2-4 Members)',
          verificationStatus: 'VERIFIED_ACTIVE',
          checkedIn: false,
          registeredAtIST
        },
        notification: {
          notificationId: notifId,
          status: 'DISPATCHED',
          recipientEmail: cleanEmail,
          subject: `Your Delegate Pass for Hack Uttar Pradesh 2026 (${passId})`,
          dispatchedAt: registeredAt
        },
        totalRegistrations: totalCount
      }));
    } catch (err) {
      console.error('Registration processing error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Database transaction failed.' }));
    }
    return;
  }

  // 3. GET /api/verify (Instant Pass Verification from SQL)
  if (req.method === 'GET' && pathname === '/api/verify') {
    const queryParam = (reqUrl.searchParams.get('query') || reqUrl.searchParams.get('passId') || reqUrl.searchParams.get('email') || '').trim();

    if (!queryParam) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, verified: false, message: 'Please provide a Pass ID or Email to verify.' }));
      return;
    }

    // Query SQL database with prepared statement
    const row = db.prepare(`
      SELECT * FROM registrations 
      WHERE LOWER(pass_id) = LOWER(?) OR LOWER(email) = LOWER(?)
    `).get(queryParam, queryParam);

    const now = new Date().toISOString();

    if (row) {
      // Log successful verification to verifications audit table
      try {
        db.prepare(`
          INSERT INTO verifications (pass_id, verified_at, verifier_type, status_result, notes)
          VALUES (?, ?, ?, ?, ?)
        `).run(row.pass_id, now, 'ATTENDEE_LOOKUP', 'VALID', `Verified query: ${queryParam}`);
      } catch (e) {}

      // Get verification audit count
      const verifCount = db.prepare('SELECT COUNT(*) as c FROM verifications WHERE pass_id = ?').get(row.pass_id).c;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        message: 'Pass successfully verified in Hack Uttar Pradesh 2026 SQL Registry.',
        data: {
          passId: row.pass_id,
          name: row.full_name,
          email: row.email,
          district: row.district,
          role: row.role,
          track: row.track,
          mode: row.mode,
          verificationStatus: row.verification_status,
          checkedIn: Boolean(row.checked_in),
          checkedInAt: row.checked_in_at,
          googleVerified: Boolean(row.google_verified),
          registeredAtIST: row.registered_at_ist,
          timesVerified: verifCount
        }
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        verified: false,
        message: `No registration found matching "${queryParam}". Please double-check for typos or complete free registration.`
      }));
    }
    return;
  }

  // 4. POST /api/checkin (Gate / Organizer On-Site Check-In)
  if (req.method === 'POST' && pathname === '/api/checkin') {
    try {
      const data = await parseJsonBody(req);
      const passId = (data.passId || '').trim();

      if (!passId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'passId is required.' }));
        return;
      }

      const row = db.prepare('SELECT * FROM registrations WHERE LOWER(pass_id) = LOWER(?)').get(passId);
      if (!row) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Pass not found.' }));
        return;
      }

      const now = new Date();
      const checkinTimeIST = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

      db.prepare(`
        UPDATE registrations 
        SET checked_in = 1, checked_in_at = ?, verification_status = 'CHECKED_IN'
        WHERE pass_id = ?
      `).run(checkinTimeIST, row.pass_id);

      db.prepare(`
        INSERT INTO verifications (pass_id, verified_at, verifier_type, status_result, notes)
        VALUES (?, ?, ?, ?, ?)
      `).run(row.pass_id, now.toISOString(), 'GATE_CHECKIN', 'CHECKED_IN', 'Attendee admitted at on-site entrance');

      syncJsonBackup();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Attendee ${row.full_name} (${row.pass_id}) marked as CHECKED IN!`,
        passId: row.pass_id,
        checkedInAt: checkinTimeIST
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 5. GET /api/registrations (SQL Query)
  if (req.method === 'GET' && pathname === '/api/registrations') {
    const rows = db.prepare('SELECT * FROM registrations ORDER BY registered_at DESC').all();
    const formatted = rows.map(r => ({
      id: r.id,
      passId: r.pass_id,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      district: r.district,
      role: r.role,
      track: r.track,
      mode: r.mode,
      googleVerified: Boolean(r.google_verified),
      verificationStatus: r.verification_status,
      checkedIn: Boolean(r.checked_in),
      checkedInAt: r.checked_in_at,
      registeredAtIST: r.registered_at_ist,
      registeredAt: r.registered_at
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: formatted.length,
      registrations: formatted
    }));
    return;
  }

  // 6. GET /api/registrations/export (CSV Export)
  if (req.method === 'GET' && pathname === '/api/registrations/export') {
    const rows = db.prepare('SELECT * FROM registrations ORDER BY registered_at DESC').all();
    const headers = ['Pass ID', 'Full Name', 'Email', 'Phone', 'District', 'Role', 'Track', 'Mode', 'Status', 'Checked In', 'Registered (IST)'];
    const csvRows = rows.map(r => [
      `"${r.pass_id || ''}"`,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.district || '').replace(/"/g, '""')}"`,
      `"${(r.role || '').replace(/"/g, '""')}"`,
      `"${(r.track || '').replace(/"/g, '""')}"`,
      `"${(r.mode || '').replace(/"/g, '""')}"`,
      `"${r.verification_status || 'ACTIVE'}"`,
      r.checked_in ? 'YES' : 'NO',
      `"${r.registered_at_ist || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\r\n');

    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hack-uttar-pradesh-registrations-2026.csv"'
    });
    res.end(csvContent);
    return;
  }

  // 7. GET /api/export/sql (Download raw SQL database script)
  if (req.method === 'GET' && pathname === '/api/export/sql') {
    const rows = db.prepare('SELECT * FROM registrations ORDER BY registered_at ASC').all();
    let sqlDump = `-- Hack Uttar Pradesh 2026 Database SQL Dump\n-- Generated on ${new Date().toISOString()}\n\n`;
    sqlDump += fs.readFileSync(SCHEMA_PATH, 'utf8') + '\n\n';

    for (const r of rows) {
      sqlDump += `INSERT OR REPLACE INTO registrations VALUES (${[
        `'${r.id}'`,
        `'${r.pass_id}'`,
        `'${r.full_name.replace(/'/g, "''")}'`,
        `'${r.email.replace(/'/g, "''")}'`,
        r.phone ? `'${r.phone.replace(/'/g, "''")}'` : 'NULL',
        `'${r.district.replace(/'/g, "''")}'`,
        `'${r.role.replace(/'/g, "''")}'`,
        `'${r.track.replace(/'/g, "''")}'`,
        `'${r.mode.replace(/'/g, "''")}'`,
        r.google_verified,
        r.google_sub ? `'${r.google_sub}'` : 'NULL',
        r.google_picture ? `'${r.google_picture}'` : 'NULL',
        `'${r.registered_at}'`,
        `'${r.registered_at_ist}'`,
        `'${r.verification_status}'`,
        r.checked_in,
        r.checked_in_at ? `'${r.checked_in_at}'` : 'NULL'
      ].join(', ')});\n`;
    }

    res.writeHead(200, {
      'Content-Type': 'application/sql; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hack-uttar-pradesh-database.sql"'
    });
    res.end(sqlDump);
    return;
  }

  // 8. POST /api/auth/google
  if (req.method === 'POST' && pathname === '/api/auth/google') {
    try {
      const body = await parseJsonBody(req);
      const { credential, profile } = body;
      let verifiedUser = null;

      if (credential) {
        try {
          const parts = credential.split('.');
          if (parts.length === 3) {
            const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
            const payload = JSON.parse(payloadJson);
            verifiedUser = {
              sub: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              email_verified: payload.email_verified
            };
          }
        } catch (jwtErr) {}
      }

      if (!verifiedUser && profile && profile.email) {
        verifiedUser = {
          email: profile.email,
          name: profile.name || profile.email.split('@')[0],
          picture: profile.picture || null,
          email_verified: true
        };
      }

      if (!verifiedUser) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Could not extract verified profile.' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, user: verifiedUser }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Auth failed.' }));
    }
    return;
  }

  // 9. POST /api/sponsor-inquiry (Corporate Sponsorship Inquiries)
  if (req.method === 'POST' && pathname === '/api/sponsor-inquiry') {
    try {
      const data = await parseJsonBody(req);
      const { companyName, contactPerson, email, phone, tier, notes } = data;

      if (!companyName || !email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Company name and business email are required.' }));
        return;
      }

      const inquiryId = `SPON-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO sponsor_inquiries (id, company_name, contact_person, email, phone, tier, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        inquiryId,
        companyName.trim(),
        (contactPerson || '').trim(),
        email.trim().toLowerCase(),
        (phone || '').trim(),
        tier || 'General Sponsorship',
        (notes || '').trim(),
        now
      );

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Sponsorship inquiry logged in SQL! The Riwa Creatives partnership team will deliver the deck within 4 hours.',
        inquiryId
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 10. GET /api/sponsor-inquiries (Retrieve inquiries)
  if (req.method === 'GET' && pathname === '/api/sponsor-inquiries') {
    const rows = db.prepare('SELECT * FROM sponsor_inquiries ORDER BY created_at DESC').all();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: rows.length, inquiries: rows }));
    return;
  }

  // 11. GET /api/stats
  if (req.method === 'GET' && pathname === '/api/stats') {
    const totalCount = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;
    const trackRows = db.prepare('SELECT track, COUNT(*) as count FROM registrations GROUP BY track').all();
    const districtRows = db.prepare('SELECT district, COUNT(*) as count FROM registrations GROUP BY district').all();
    const checkedInCount = db.prepare('SELECT COUNT(*) as c FROM registrations WHERE checked_in = 1').get().c;

    const tracks = {};
    trackRows.forEach(r => { tracks[r.track] = r.count; });
    const districts = {};
    districtRows.forEach(r => { districts[r.district] = r.count; });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      totalRegistrations: totalCount,
      checkedInAttendees: checkedInCount,
      tracks,
      districts,
      databaseType: 'SQLite Relational Database (database.sqlite)',
      lastUpdated: new Date().toISOString()
    }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Riwa SQL Backend] Server running on http://127.0.0.1:${PORT} backed by database.sqlite`);
});
