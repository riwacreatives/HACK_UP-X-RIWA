import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    c_orange = colors.HexColor('#FF5500')
    c_orange_dark = colors.HexColor('#CC4400')
    c_dark = colors.HexColor('#0F172A')
    c_sub = colors.HexColor('#475569')
    c_green = colors.HexColor('#059669')
    c_green_bg = colors.HexColor('#ECFDF5')
    c_border = colors.HexColor('#CBD5E1')
    c_bg_light = colors.HexColor('#F8FAFC')
    c_card_bg = colors.HexColor('#F8FAFC')
    c_highlight = colors.HexColor('#FFF7ED')

    # Typography Styles
    style_kicker = ParagraphStyle(
        'Kicker',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=c_orange,
        textTransform='uppercase',
        spaceAfter=3
    )

    style_main_title = ParagraphStyle(
        'MainTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_dark,
        spaceAfter=4
    )

    style_subtitle = ParagraphStyle(
        'SubTitle',
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=c_sub,
        spaceAfter=8
    )

    style_h1 = ParagraphStyle(
        'H1',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=c_dark,
        spaceBefore=12,
        spaceAfter=6
    )

    style_h2 = ParagraphStyle(
        'H2',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_orange_dark,
        spaceBefore=8,
        spaceAfter=4
    )

    style_body = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    style_body_bold = ParagraphStyle(
        'BodyBold',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=c_dark
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )

    style_table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=c_dark
    )

    style_callout = ParagraphStyle(
        'Callout',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    elements = []

    # ==================== PAGE 1: EXECUTIVE BRIEF & TRACTION ====================
    elements.append(Paragraph("RIWA CREATIVES • OFFICIAL PARTNERSHIP & SPONSORSHIP PROSPECTUS", style_kicker))
    elements.append(Paragraph("Hack Uttar Pradesh 2026", style_main_title))
    elements.append(Paragraph("Comprehensive Collaboration & Value-Exchange Framework for Industry Partners", style_subtitle))
    elements.append(HRFlowable(width="100%", thickness=2, color=c_orange, spaceBefore=2, spaceAfter=8))

    # Live Traction Banner
    traction_html = (
        "<b>🔥 VERIFIED LIVE TRACTION:</b> "
        "<b>50,000+ Organic Impressions</b> across regional tech networks &nbsp;|&nbsp; "
        "<b>120+ Squad Registrations in the first 48–72 hours</b> &nbsp;|&nbsp; "
        "<b>240 In-Person Finalists (60 Squads)</b> from top institutes across 75 Districts"
    )
    t_trac = Table([[Paragraph(traction_html, style_body_bold)]], colWidths=[540])
    t_trac.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_green_bg),
        ('BOX', (0,0), (-1,-1), 1.2, c_green),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_trac)
    elements.append(Spacer(1, 8))

    # Section 1: Executive Overview & Value Proposition
    elements.append(Paragraph("1. Executive Overview & Mission", style_h1))
    p_overview = (
        "<b>Hack Uttar Pradesh 2026</b>, organized by <b>Riwa Creatives</b> (riwacreatives.in), is Northern India’s "
        "flagship open-source and frontier-tech hybrid hackathon. We are establishing an authentic bridge between "
        "ambitious student builders from tier-2/3 institutions and industry-leading developer tools, enterprise platforms, "
        "and venture scouts. Operating in a high-efficiency <b>Hybrid Model</b>, squads participate in nationwide virtual ideation "
        "and online sprints followed by an exclusive <b>Grand Finale on January 11, 2026</b> for 240 shortlisted finalists "
        "at open greens workstations in Lucknow and Greater Noida."
    )
    elements.append(Paragraph(p_overview, style_body))
    elements.append(Spacer(1, 8))

    # Section 2: Why Collaborate? What We Provide in Exchange
    elements.append(Paragraph("2. Core ROI: What Partners Receive in Exchange", style_h1))
    roi_points = [
        ("High-Intent Developer Adoption", "Direct hands-on integration of your APIs, SDKs, or cloud platforms by 240 top builders actively pushing code in real-time."),
        ("Pre-Screened Talent Acquisition", "Full access to our verified SQL registry, GitHub commit trails, and direct on-site Pre-Placement Offer (PPO/PPI) interviews."),
        ("Statewide Brand Immersion", "High-frequency visual branding on physical stage backdrops, 240+ cryptographic NFC/QR attendee passes, and social channels reaching 50K+ developers."),
        ("Thought Leadership & Keynote Presence", "Keynote address, technical workshop masterclasses, and an authoritative seat on the Grand Jury alongside founders & tech leaders.")
    ]
    roi_table_data = [[
        Paragraph(f"<b>• {r[0]}:</b>", style_body_bold),
        Paragraph(r[1], style_body)
    ] for r in roi_points]
    t_roi = Table(roi_table_data, colWidths=[150, 390])
    t_roi.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, c_bg_light),
    ]))
    elements.append(t_roi)
    elements.append(Spacer(1, 8))

    # Student-First Policy Note
    exam_policy = (
        "<b>Student-First Examination Safeguard Policy:</b> "
        "To protect academic interests across Indian engineering institutions (AKTU, state technical boards, and central universities), "
        "the offline Grand Finale date is structurally adaptable. If semester or practical exams clash with the physical sprint, "
        "the in-person date will be strategically shifted by a few days so no qualified finalist loses their chance to compete in the finale."
    )
    t_exam = Table([[Paragraph(exam_policy, style_callout)]], colWidths=[540])
    t_exam.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF3C7')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#F59E0B')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_exam)
    elements.append(Spacer(1, 10))

    # ==================== SECTION 3: DETAILED COLLABORATION LEVELS ====================
    elements.append(Paragraph("3. Partnership Levels & Mutual Exchange Matrix", style_h1))
    
    matrix_headers = [
        Paragraph("Collaboration Tier", style_table_header),
        Paragraph("Partner Contribution", style_table_header),
        Paragraph("What We Provide in Exchange (Partner ROI)", style_table_header)
    ]

    tier1_exchange = (
        "• <b>Co-Branding Rights:</b> 'Hack Uttar Pradesh 2026 Powered by [Brand] & Riwa'<br/>"
        "• <b>Grand Opening Keynote Address</b> (20-30 mins live on main stage)<br/>"
        "• <b>2 Dedicated Seats</b> on the Grand Jury evaluating top finalist pitches<br/>"
        "• <b>VIP Pavilion & Booth</b> at the Lucknow & Noida Open Greens workstations<br/>"
        "• <b>Full Talent Pipeline:</b> Direct PPO/PPI interview privileges & complete verified SQL resume registry<br/>"
        "• <b>Prime Logo Placement:</b> Header position on official website, GitHub repo, passes & stage backdrop"
    )

    tier2_exchange = (
        "• <b>Track Title Rights:</b> Exclusive naming of 1 of 5 tracks (e.g. 'The [Brand] AI for Bharat Arena')<br/>"
        "• <b>Custom Bounty Definition:</b> Mandate the use of your APIs, SDKs, or tools for track prize eligibility<br/>"
        "• <b>45-Minute Hands-on Technical Workshop</b> broadcast to all participants<br/>"
        "• <b>1 Seat on Track Judging Panel</b> & stage presentation of track winners<br/>"
        "• <b>Dedicated Community Channel:</b> Private Discord channel for direct dev support"
    )

    tier3_exchange = (
        "• <b>High-Impact Physical Branding:</b> Exclusive naming of solar battery charging pods, 10Gbps Wi-Fi splash portal, or Starlit Night Coding Lounge<br/>"
        "• <b>Signature Hospitality Branding:</b> 'Kulhad Chai & Refreshment Lounge Powered by [Brand]'<br/>"
        "• <b>Swag & Collateral Insertion:</b> Custom stickers, t-shirts, or flyers included in all 240 finalist swag bags<br/>"
        "• <b>Mid-Tier Logo Placement</b> on official portal, GitHub, and email broadcasts"
    )

    tier4_exchange = (
        "• <b>Verified SQL Resume Database:</b> Complete export of all participating engineers, designers & builders<br/>"
        "• <b>GitHub Portfolio & Commit Insights:</b> Pre-evaluated code quality metrics of all 240 finalists<br/>"
        "• <b>On-Site Interview Booth:</b> Conduct live technical interviews and issue instant PPO/PPI letters<br/>"
        "• <b>Logo on Recruitment Section</b> of website, digital passes & certificate credentials"
    )

    tier5_exchange = (
        "• <b>Official Tooling Partner Badge</b> across website, GitHub, and digital documentation<br/>"
        "• <b>Product Adoption:</b> Your tool/API featured in the official hacker handbook & starter repos<br/>"
        "• <b>Product Masterclass:</b> 30-min hands-on virtual demo showing builders how to build with your product<br/>"
        "• <b>Track Bounty Integration:</b> Co-sponsor 'Best Project Built with [Tool]' category prize<br/>"
        "• <b>Physical Swag Distribution</b> inside finalist welcome kits"
    )

    matrix_rows = [
        matrix_headers,
        [
            Paragraph("<b>Tier 01: Title / Presenting Partner</b><br/><font color='#CC4400'>₹5,00,000 / ~$6,000<br/>(1 Exclusive Partner)</font>", style_table_cell_bold),
            Paragraph("Anchor financial sponsorship powering grand cash prizes, venue infrastructure, and statewide media outreach.", style_table_cell),
            Paragraph(tier1_exchange, style_table_cell)
        ],
        [
            Paragraph("<b>Tier 02: Track Arena Partner</b><br/><font color='#CC4400'>₹1,50,000 / ~$1,800<br/>(Up to 5 Partners)</font>", style_table_cell_bold),
            Paragraph("Sponsorship of 1 strategic challenge track (AI, ODOP, AgriTech, Spatial Web, or GovTech) + track cash bounty.", style_table_cell),
            Paragraph(tier2_exchange, style_table_cell)
        ],
        [
            Paragraph("<b>Tier 03: Open Greens & Infrastructure</b><br/><font color='#CC4400'>₹75,000 / ~$900<br/>(Multiple Partners)</font>", style_table_cell_bold),
            Paragraph("Funding for open-air coding workstations, solar generators, high-speed mesh Wi-Fi, or refreshments.", style_table_cell),
            Paragraph(tier3_exchange, style_table_cell)
        ],
        [
            Paragraph("<b>Tier 04: Talent & Hiring Partner</b><br/><font color='#CC4400'>₹35,000 / ~$420<br/>(Recruitment Focused)</font>", style_table_cell_bold),
            Paragraph("Direct talent recruitment sponsorship + commitment to extend Pre-Placement Offers (PPOs/PPIs).", style_table_cell),
            Paragraph(tier4_exchange, style_table_cell)
        ],
        [
            Paragraph("<b>Tier 05: Ecosystem & Tooling Partner</b><br/><font color='#059669'>In-Kind / Product Credits / Mentorship<br/>(e.g., Cloud, AI, APIs)</font>", style_table_cell_bold),
            Paragraph("Developer tool access, free API/cloud credits, trial licenses, technical mentors, or branded swag.", style_table_cell),
            Paragraph(tier5_exchange, style_table_cell)
        ]
    ]

    t_matrix = Table(matrix_rows, colWidths=[120, 130, 290])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
    ]))
    elements.append(t_matrix)
    elements.append(Spacer(1, 10))

    # ==================== SECTION 4: CONTACT & NEXT STEPS ====================
    elements.append(Paragraph("4. How to Finalize Your Collaboration", style_h1))
    p_cta = (
        "We believe in tailored, mutually beneficial partnerships. Whether your objective is engineering adoption, "
        "brand leadership, hiring the top 1% of student talent, or developer community goodwill, we can customize deliverables "
        "to align perfectly with your Q1 2026 strategic goals."
    )
    elements.append(Paragraph(p_cta, style_body))
    elements.append(Spacer(1, 6))

    contact_data = [
        [Paragraph("<b>Official Organizer:</b>", style_body_bold), Paragraph("Riwa Creatives (Design Agency & Venture Foundry)", style_body)],
        [Paragraph("<b>Website Portal:</b>", style_body_bold), Paragraph("https://riwacreatives.in", style_body)],
        [Paragraph("<b>GitHub Organization:</b>", style_body_bold), Paragraph("https://github.com/riwacreatives/HACK_UP-X-RIWA", style_body)],
        [Paragraph("<b>Partnerships Desk:</b>", style_body_bold), Paragraph("riwacreatives@gmail.com &nbsp;|&nbsp; Instagram: @madebyriwa &nbsp;|&nbsp; LinkedIn: /company/144023065", style_body)]
    ]
    t_contact = Table(contact_data, colWidths=[130, 410])
    t_contact.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_contact)
    elements.append(Spacer(1, 8))

    elements.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=4))
    elements.append(Paragraph(
        "Hack Uttar Pradesh 2026 • Curated with pride in Uttar Pradesh • All Rights Reserved © Riwa Creatives",
        ParagraphStyle('Foot', fontName='Helvetica', fontSize=7.5, leading=9, textColor=c_sub, alignment=TA_CENTER)
    ))

    doc.build(elements)
    print(f"Generated comprehensive proposal PDF at: {filename}")

if __name__ == "__main__":
    out_file = r"e:\Hack-Utterpradesh[RIWA - CRERATIVES]\HACK_UTTAR_PRADESH_2026_COLLABORATION_PROPOSAL.pdf"
    build_pdf(out_file)
