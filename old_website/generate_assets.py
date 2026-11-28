import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    W, H = 1920, 557
    img = Image.new("RGBA", (W, H), (10, 11, 15, 255))

    # 1. Background gradient / ambient glows
    glow_orange = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_orange)
    
    # Left warm orange glow
    for r in range(400, 0, -20):
        alpha = int((1 - r / 400) * 45)
        glow_draw.ellipse([(-100 + 400 - r), (H // 2 - r), (-100 + 400 + r), (H // 2 + r)], fill=(255, 85, 0, alpha))
        
    # Right cyan/mint tech glow
    for r in range(450, 0, -20):
        alpha = int((1 - r / 450) * 35)
        glow_draw.ellipse([(W - 300 - r), (H // 2 - r), (W - 300 + r), (H // 2 + r)], fill=(16, 185, 129, alpha))
    
    # Top subtle violet/blue glow
    for r in range(350, 0, -25):
        alpha = int((1 - r / 350) * 25)
        glow_draw.ellipse([(W // 2 - r), (-150 - r), (W // 2 + r), (-150 + r)], fill=(99, 102, 241, alpha))

    img = Image.alpha_composite(img, glow_orange)

    # 2. Draw subtle tech grid
    grid_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_overlay)
    grid_size = 48
    for x in range(0, W, grid_size):
        grid_draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, grid_size):
        grid_draw.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)
    
    # Grid dots at intersections
    for x in range(0, W, grid_size * 2):
        for y in range(0, H, grid_size * 2):
            grid_draw.rectangle([x-1, y-1, x+1, y+1], fill=(255, 255, 255, 25))

    img = Image.alpha_composite(img, grid_overlay)

    # 3. Fonts
    font_dir = "C:/Windows/Fonts"
    font_title = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 68)
    font_subtitle = ImageFont.truetype(os.path.join(font_dir, "segoeuil.ttf"), 24)
    font_badge = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 16)
    font_pill = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 18)
    font_tag = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 15)
    font_meta = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 17)

    # 4. Composite Riwa Logo on Left
    if os.path.exists("riwa-logo.png"):
        logo = Image.open("riwa-logo.png").convert("RGBA")
        logo_size = 280
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Logo glow backing
        logo_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        lg_draw = ImageDraw.Draw(logo_glow)
        cx, cy = 200, H // 2
        for r in range(160, 0, -10):
            alpha = int((1 - r / 160) * 30)
            lg_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 100, 20, alpha))
        img = Image.alpha_composite(img, logo_glow)
        
        # Paste logo
        img.paste(logo, (cx - logo_size // 2, cy - logo_size // 2), logo)

    # Content Left Margin
    content_x = 380

    # 5. Top kicker badge
    kicker_y = 65
    draw_badge(img, content_x, kicker_y, "RIWA CREATIVES PRESENTS  •  UTTAR PRADESH'S LARGEST HYBRID HACKATHON", 
               bg_color=(255, 85, 0, 35), border_color=(255, 85, 0, 160), text_color=(255, 140, 50, 255), font=font_tag)

    # 6. Main Title with subtle shadow & vibrant text
    title_y = 115
    title_text = "HACK UTTAR PRADESH 2026"
    draw_text_shadow(img, (content_x, title_y), title_text, font_title, text_color=(255, 255, 255, 255), shadow_color=(0, 0, 0, 180), offset=(3, 3))

    # 7. Subtitle / Mission Statement
    sub_y = 205
    sub_text = "Building Frontier Tech, AI & Digital Public Goods • Grand Finale on January 11, 2026"
    draw_text(img, (content_x, sub_y), sub_text, font_subtitle, (180, 190, 205, 255))

    # 8. Feature Cards / Value Props (No incubation; added ₹19,000 rewards/merch; Jan 11 date)
    cards_y = 265
    cards = [
        {"title": "₹45,000+ CASH", "sub": "+ Direct PPO & PPIs", "border": (255, 85, 0, 180), "bg": (255, 85, 0, 25), "text": (255, 120, 40, 255)},
        {"title": "₹19,000+ REWARDS", "sub": "Merch, Swag & Kits", "border": (16, 185, 129, 180), "bg": (16, 185, 129, 25), "text": (52, 211, 153, 255)},
        {"title": "240 BUILDERS", "sub": "60 Shortlisted Squads", "border": (99, 102, 241, 180), "bg": (99, 102, 241, 25), "text": (165, 180, 252, 255)},
        {"title": "JANUARY 11, 2026", "sub": "Offline Finale Day", "border": (234, 179, 8, 180), "bg": (234, 179, 8, 25), "text": (250, 204, 21, 255)}
    ]

    card_x = content_x
    card_w = 265
    card_h = 80
    card_spacing = 20

    for c in cards:
        draw_feature_card(img, card_x, cards_y, card_w, card_h, c["title"], c["sub"], c["bg"], c["border"], c["text"], font_pill, font_meta)
        card_x += card_w + card_spacing

    # 9. Bottom Bar / Metadata Strip
    bot_y = 400
    divider_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(divider_overlay)
    d_draw.line([(content_x, bot_y), (W - 100, bot_y)], fill=(255, 255, 255, 30), width=1)
    img = Image.alpha_composite(img, divider_overlay)

    # Tracks Pill list
    meta_y = 430
    tracks_label = "CHALLENGE ARENAS:"
    draw_text(img, (content_x, meta_y + 4), tracks_label, font_tag, (140, 150, 170, 255))
    
    arenas = ["AI for Bharat", "ODOP Heritage", "AgriTech", "Spatial Web", "Open Innovation"]
    tx = content_x + 170
    for a in arenas:
        tw = draw_mini_tag(img, tx, meta_y, a, font_tag)
        tx += tw + 14

    # Right side: Official URL & Date Badge
    date_pill_text = "REGISTRATION DEADLINE DEC 31 • HACKATHON DAY JAN 11, 2026"
    draw_badge(img, W - 530, meta_y - 2, date_pill_text, bg_color=(255, 255, 255, 12), border_color=(255, 255, 255, 60), text_color=(240, 240, 240, 255), font=font_tag)

    # 10. Border outline
    border_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(border_layer)
    b_draw.rectangle([0, 0, W - 1, H - 1], outline=(255, 85, 0, 70), width=2)
    img = Image.alpha_composite(img, border_layer)

    output_path = "hackup_banner_1920x557.png"
    img.convert("RGB").save(output_path, "PNG", quality=95)
    print(f"Created banner: {output_path} ({W}x{H})")


def create_card():
    W, H = 700, 400
    img = Image.new("RGBA", (W, H), (12, 13, 18, 255))

    # Glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    for r in range(250, 0, -15):
        alpha = int((1 - r / 250) * 45)
        g_draw.ellipse([(-60 + 200 - r), (-40 + 150 - r), (-60 + 200 + r), (-40 + 150 + r)], fill=(255, 85, 0, alpha))
    for r in range(220, 0, -15):
        alpha = int((1 - r / 220) * 35)
        g_draw.ellipse([(W - 100 - r), (H - 80 - r), (W - 100 + r), (H - 80 + r)], fill=(16, 185, 129, alpha))
    img = Image.alpha_composite(img, glow)

    # Subtle Grid
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gr_draw = ImageDraw.Draw(grid)
    step = 32
    for x in range(0, W, step):
        gr_draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, step):
        gr_draw.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)
    img = Image.alpha_composite(img, grid)

    font_dir = "C:/Windows/Fonts"
    font_main = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 38)
    font_kicker = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 13)
    font_body = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 15)
    font_bold_sm = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 15)
    font_stat_val = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 20)
    font_stat_sub = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 12)

    # Top header with logo
    if os.path.exists("riwa-logo.png"):
        logo = Image.open("riwa-logo.png").convert("RGBA")
        logo = logo.resize((60, 60), Image.Resampling.LANCZOS)
        img.paste(logo, (36, 32), logo)

    # Organizer text next to logo
    draw_text(img, (108, 38), "RIWA CREATIVES", font_bold_sm, (255, 120, 40, 255))
    draw_text(img, (108, 58), "riwacreatives.in", font_stat_sub, (140, 150, 170, 255))

    # Badge Top Right
    draw_badge(img, W - 200, 40, "HYBRID HACKATHON", bg_color=(16, 185, 129, 30), border_color=(16, 185, 129, 160), text_color=(52, 211, 153, 255), font=font_kicker)

    # Main Title
    draw_text_shadow(img, (36, 115), "HACK UTTAR PRADESH", font_main, text_color=(255, 255, 255, 255), shadow_color=(0,0,0,160), offset=(2, 2))
    
    # Year Pill / Accent
    draw_text(img, (490, 115), "2026", font_main, (255, 110, 30, 255))

    # Tagline
    draw_text(img, (36, 168), "Northern India's Premier Frontier Tech Sprint • Jan 11, 2026", font_body, (180, 190, 205, 255))

    # 3 Stat Cards (No incubation; added ₹19K merch/rewards)
    stat_y = 210
    stat_w = 194
    stat_h = 75
    stat_gap = 21
    
    stats = [
        {"val": "₹45,000+", "sub": "Cash + Direct PPO/PPI", "border": (255, 85, 0, 180), "bg": (255, 85, 0, 25), "c": (255, 130, 45, 255)},
        {"val": "₹19,000+", "sub": "Merch, Swag & Kits", "border": (16, 185, 129, 180), "bg": (16, 185, 129, 25), "c": (52, 211, 153, 255)},
        {"val": "240 FINALISTS", "sub": "60 Squads • Jan 11", "border": (99, 102, 241, 180), "bg": (99, 102, 241, 25), "c": (165, 180, 252, 255)}
    ]

    sx = 36
    for s in stats:
        draw_feature_card(img, sx, stat_y, stat_w, stat_h, s["val"], s["sub"], s["bg"], s["border"], s["c"], font_stat_val, font_stat_sub)
        sx += stat_w + stat_gap

    # Footer banner
    foot_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    f_draw = ImageDraw.Draw(foot_overlay)
    f_draw.line([(36, 312), (W - 36, 312)], fill=(255, 255, 255, 30), width=1)
    img = Image.alpha_composite(img, foot_overlay)

    # Bottom Details
    draw_text(img, (36, 335), "TIMELINE:", font_bold_sm, (140, 150, 170, 255))
    draw_text(img, (115, 335), "Reg Closes Dec 31  •  Hackathon Day: January 11, 2026", font_body, (220, 225, 235, 255))

    draw_badge(img, W - 145, 330, "FREE ENTRY", bg_color=(255, 255, 255, 15), border_color=(255, 255, 255, 70), text_color=(255, 255, 255, 255), font=font_kicker)

    # Outer border
    border = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(border)
    b_draw.rectangle([0, 0, W - 1, H - 1], outline=(255, 85, 0, 70), width=2)
    img = Image.alpha_composite(img, border)

    output_path = "hackup_card_700x400.png"
    img.convert("RGB").save(output_path, "PNG", quality=95)
    print(f"Created card: {output_path} ({W}x{H})")


def draw_text(img, pos, text, font, color):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text(pos, text, font=font, fill=color)
    img.paste(Image.alpha_composite(img, layer))


def draw_text_shadow(img, pos, text, font, text_color, shadow_color, offset=(2, 2)):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((pos[0] + offset[0], pos[1] + offset[1]), text, font=font, fill=shadow_color)
    d.text(pos, text, font=font, fill=text_color)
    img.paste(Image.alpha_composite(img, layer))


def draw_badge(img, x, y, text, bg_color, border_color, text_color, font, pad_x=14, pad_y=6):
    dummy = ImageDraw.Draw(img)
    bbox = dummy.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    bw = tw + pad_x * 2
    bh = th + pad_y * 2
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    radius = bh // 2
    d.rounded_rectangle([x, y, x + bw, y + bh], radius=radius, fill=bg_color, outline=border_color, width=1)
    d.text((x + pad_x, y + pad_y - 1), text, font=font, fill=text_color)
    
    img.paste(Image.alpha_composite(img, overlay))
    return bw


def draw_mini_tag(img, x, y, text, font):
    dummy = ImageDraw.Draw(img)
    bbox = dummy.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    pad_x = 10
    pad_y = 4
    bw = tw + pad_x * 2
    bh = th + pad_y * 2
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle([x, y, x + bw, y + bh], radius=6, fill=(255, 255, 255, 12), outline=(255, 255, 255, 35), width=1)
    d.text((x + pad_x, y + pad_y - 1), text, font=font, fill=(210, 220, 235, 255))
    img.paste(Image.alpha_composite(img, overlay))
    return bw


def draw_feature_card(img, x, y, w, h, title, sub, bg_color, border_color, title_color, font_title, font_sub):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle([x, y, x + w, y + h], radius=10, fill=bg_color, outline=border_color, width=1)
    
    # Title
    d.text((x + 16, y + 14), title, font=font_title, fill=title_color)
    # Sub
    d.text((x + 16, y + 44), sub, font=font_sub, fill=(180, 190, 205, 255))
    img.paste(Image.alpha_composite(img, overlay))

if __name__ == "__main__":
    create_banner()
    create_card()
