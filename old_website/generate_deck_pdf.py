import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def generate_deck_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Colors
    c_orange = colors.HexColor('#FF5500')
    c_dark = colors.HexColor('#0D1117')
    c_sub = colors.HexColor('#4A5568')
    c_green = colors.HexColor('#059669')
    c_card_bg = colors.HexColor('#F8FAFC')
    c_border = colors.HexColor('#E2E8F0')

    # Custom Styles
    style_kicker = ParagraphStyle(
        'Kicker',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=11,
        textColor=c_orange,
        alignment=TA_LEFT,
        textTransform='uppercase'
    )

    style_title = ParagraphStyle(
        'MainTitle',
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_dark,
        alignment=TA_LEFT
    )

    style_subtitle = ParagraphStyle(
        'SubTitle',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_sub,
        alignment=TA_LEFT
    )

    style_h2 = ParagraphStyle(
        'Heading2',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=c_dark,
        spaceBefore=10,
        spaceAfter=5
    )

    style_body = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#2D3748')
    )

    style_body_bold = ParagraphStyle(
        'BodyBold',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=c_dark
    )

    style_callout = ParagraphStyle(
        'Callout',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1A202C')
    )

    style_traction = ParagraphStyle(
        'Traction',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_green
    )

    elements = []

    # Header Banner Block
    elements.append(Paragraph("RIWA CREATIVES • OFFICIAL EVENT PROSPECTUS", style_kicker))
    elements.append(Spacer(1, 3))
    elements.append(Paragraph("Hack Uttar Pradesh 2026", style_title))
    elements.append(Paragraph("Northern India's Premier Frontier-Tech & Workflow Automation Sprint", style_subtitle))
    elements.append(Spacer(1, 6))
    elements.append(HRFlowable(width="100%", thickness=2, color=c_orange, spaceBefore=2, spaceAfter=10))

    # Real-Time Traction Banner (50k+ Reach, 120+ Registrations in 48-72h)
    traction_text = (
        "<b>🔥 RAPID TRACTION UPDATE:</b> "
        "<b>50,000+ Organic Reach</b> across regional student & dev networks &nbsp;|&nbsp; "
        "<b>120+ Squad Registrations received in the first 48–72 hours</b> of launch!"
    )
    t_traction = Table([[Paragraph(traction_text, style_traction)]], colWidths=[530])
    t_traction.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#ECFDF5')),
        ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor('#10B981')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(t_traction)
    elements.append(Spacer(1, 8))

    # Executive Overview
    elements.append(Paragraph("1. Executive Summary & Verified Scale", style_h2))
    p1 = ("<b>Hack Uttar Pradesh 2026</b> is organized by <b>Riwa Creatives</b> (riwacreatives.in) "
          "to bridge the grassroots industrial and civic landscape of Uttar Pradesh with world-class software engineering. "
          "The event operates in a <b>Hybrid Architecture</b>: an online build sprint followed by an intensive "
          "<b>Grand Finale for 240 shortlisted finalists (60 squads of 1–4 builders)</b> hosted at curated open greens in "
          "Lucknow and Greater Noida.")
    elements.append(Paragraph(p1, style_body))
    elements.append(Spacer(1, 8))

    # Key Metrics Table
    metrics_data = [
        [Paragraph("<b>Live Early Traction</b>", style_body_bold), Paragraph("<b>50,000+ Impressions</b> & <b>120+ Registrations</b> in the first 2–3 days alone", style_body)],
        [Paragraph("<b>Finalist Cohort</b>", style_body_bold), Paragraph("240 Shortlisted Finalists (60 Squads) • 1,500+ Expected Total Applicants across 75 Districts", style_body)],
        [Paragraph("<b>Format & Dates</b>", style_body_bold), Paragraph("Hybrid: Virtual Sprint (Jan 01–08) + In-Person Grand Finale Day (January 2026)", style_body)],
        [Paragraph("<b>Prize & Rewards Pool</b>", style_body_bold), Paragraph("₹45,000+ Direct Cash Awards + ₹19,000+ Verified Merchandise Bundles & Direct PPOs", style_body)],
        [Paragraph("<b>Host Organization</b>", style_body_bold), Paragraph("Riwa Creatives (Creative Design Studio & Venture Foundry • riwacreatives.in)", style_body)]
    ]
    t_metrics = Table(metrics_data, colWidths=[140, 390])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t_metrics)
    elements.append(Spacer(1, 10))

    # Academic Schedule Flexibility Policy
    elements.append(Paragraph("2. Academic Calendar Flexibility & Inclusivity Safeguard", style_h2))
    callout_text = (
        "<b>Student-First Exam Policy:</b> "
        "University examination dates across Indian engineering institutions (AKTU, state boards, central universities) "
        "can occasionally shift. Our organizing committee actively monitors semester exam schedules across all shortlisted teams. "
        "<b>If semester exam dates clash with the offline sprint, the in-person Grand Finale date will be strategically shifted "
        "by a few days to ensure that no qualified finalist misses out on the physical finale</b>. "
        "Virtual prelims, mentorship, and project submissions remain completely flexible and unaffected."
    )
    t_callout = Table([[Paragraph(callout_text, style_callout)]], colWidths=[530])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF3C7')),
        ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor('#F59E0B')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(t_callout)
    elements.append(Spacer(1, 10))

    # Challenge Arenas
    elements.append(Paragraph("3. Core Innovation Arenas", style_h2))
    tracks = [
        ("AI for Bharat & Vernacular Tech", "Autonomous agent workflows, Indic NLP, speech-to-speech agents, and civic service automation."),
        ("ODOP & Artisan Heritage Supply Chains", "One District One Product inventory pipelines, provenance tracking, and decentralized artisan commerce."),
        ("AgriTech & Rural Infrastructure", "Real-time mandi price telemetry, weather alert triggers, sensor data pipelines, and logistics routing."),
        ("Spatial Web & Civic IoT", "Urban transit routing, municipal triage bots, GIS dashboards, and citizen grievance telemetry."),
        ("Open Innovation & GovTech Public Goods", "Offline-first UPI solutions, healthcare triage, cybersecurity, and API integrations.")
    ]
    track_rows = [[Paragraph(f"<b>• {t[0]}:</b> {t[1]}", style_body)] for t in tracks]
    t_tracks = Table(track_rows, colWidths=[530])
    t_tracks.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_tracks)
    elements.append(Spacer(1, 10))

    # n8n Partnership Role
    elements.append(Paragraph("4. How n8n Empowers Our Builders", style_h2))
    p_n8n = (
        "As an official Workflow Automation & AI Orchestration Partner, n8n will be the recommended automation backend "
        "for participants building multi-step agentic pipelines. We offer n8n a featured 45-minute technical workshop, "
        "a branded track bounty (<i>'Best Automation / AI Workflow Powered by n8n'</i>), digital branding across our "
        "platform, and an honorary judging seat."
    )
    elements.append(Paragraph(p_n8n, style_body))
    elements.append(Spacer(1, 10))

    # Contact & Links Footer
    elements.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))
    f_text = (
        "<b>Website:</b> https://riwacreatives.in &nbsp;|&nbsp; "
        "<b>GitHub:</b> https://github.com/riwacreatives/HACK_UP-X-RIWA &nbsp;|&nbsp; "
        "<b>Contact:</b> riwacreatives@gmail.com"
    )
    elements.append(Paragraph(f_text, ParagraphStyle('Foot', fontName='Helvetica', fontSize=8, leading=10, textColor=c_sub, alignment=TA_CENTER)))

    doc.build(elements)
    print(f"Generated updated PDF successfully at: {output_path}")

if __name__ == "__main__":
    out_dir = r"e:\Hack-Utterpradesh[RIWA - CRERATIVES]"
    pdf_file = os.path.join(out_dir, "HACK_UTTAR_PRADESH_2026_OVERVIEW.pdf")
    generate_deck_pdf(pdf_file)
