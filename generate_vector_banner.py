import cv2
import numpy as np

# 1. High-res Riwa bird mascot extraction
im_riwa = cv2.imread('riwa_crop_detail.png')
hsv_riwa = cv2.cvtColor(im_riwa, cv2.COLOR_BGR2HSV)
mask_riwa = cv2.inRange(hsv_riwa, np.array([5, 80, 80]), np.array([25, 255, 255]))
contours_r, _ = cv2.findContours(mask_riwa, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
all_pts = []
for cnt in contours_r:
    if cv2.contourArea(cnt) > 6:
        all_pts.extend(cnt.reshape(-1, 2))
all_pts = np.array(all_pts)
rx0, ry0, rbw, rbh = cv2.boundingRect(all_pts)
rtx, rty, rtw, rth = 68, 54, 82, 112
rsx = rtw / rbw
rsy = rth / rbh

riwa_subpaths = []
for cnt in contours_r:
    if cv2.contourArea(cnt) < 6:
        continue
    approx = cv2.approxPolyDP(cnt, 0.6, True)
    if len(approx) < 3:
        continue
    pts = [f'{rtx + (pt[0][0] - rx0) * rsx:.1f} {rty + (pt[0][1] - ry0) * rsy:.1f}' for pt in approx]
    riwa_subpaths.append('M ' + ' L '.join(pts) + ' Z')

riwa_path = ' '.join(riwa_subpaths)

# 2. Icon badge extraction
im_badge = cv2.imread('new_website/assets/icon_badge.png', cv2.IMREAD_UNCHANGED)
alpha = im_badge[:, :, 3]
bgr = im_badge[:, :, :3]
r = bgr[:, :, 2].astype(int)
g = bgr[:, :, 1].astype(int)
b = bgr[:, :, 0].astype(int)

orange_mask = ((r > 190) & (g > 70) & (g < 170) & (b < 80) & (alpha > 128)).astype(np.uint8) * 255
green_mask = ((r < 80) & (g > 115) & (b < 140) & (alpha > 128)).astype(np.uint8) * 255
navy_mask = ((r < 60) & (g < 70) & (b < 95) & (alpha > 128)).astype(np.uint8) * 255

btx, bty, btw, bth = 855, 55, 116, 116
bbx, bby, bbw, bbh = 111, 111, 802, 802
bscale = btw / bbw

def mask_to_svg(mask, eps=1.2):
    contours, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    subpaths = []
    for cnt in contours:
        if cv2.contourArea(cnt) < 20:
            continue
        approx = cv2.approxPolyDP(cnt, eps, True)
        if len(approx) < 3:
            continue
        pts = [f'{btx + (pt[0][0] - bbx) * bscale:.1f} {bty + (pt[0][1] - bby) * bscale:.1f}' for pt in approx]
        subpaths.append('M ' + ' L '.join(pts) + ' Z')
    return ' '.join(subpaths)

badge_orange = mask_to_svg(orange_mask)
badge_green = mask_to_svg(green_mask)
badge_navy = mask_to_svg(navy_mask)

svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 800" width="100%" height="100%">
  <defs>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800;900&amp;display=swap");
      .font-tech {{ font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
    </style>
    <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="2.2" fill="#D95822" opacity="0.68" />
    </pattern>
  </defs>

  <!-- 1. Background Cream Canvas -->
  <rect width="1400" height="800" fill="#F4EFE5" />

  <!-- 2. Top Header Accent Stripes -->
  <rect x="0" y="0" width="1400" height="30" fill="#102A43" />
  <rect x="0" y="30" width="1400" height="7" fill="#F07832" />

  <!-- 3. Riwa Mascot & Header Branding -->
  <g id="riwaBrand">
    <!-- Vector traced bird with eye, wings, legs, and Riwa wordmark with cutouts -->
    <path d="{riwa_path}" fill="#F07832" fill-rule="evenodd" />
    <line x1="166" y1="58" x2="166" y2="152" stroke="#102A43" stroke-width="1.8" opacity="0.35" />
    <text x="180" y="90" class="font-tech" font-size="20" font-weight="900" fill="#102A43" letter-spacing="0.16em">PRESENTS</text>
    <text x="180" y="118" class="font-tech" font-size="14.5" font-weight="800" fill="#169855" letter-spacing="0.14em">OPEN-SOURCE • FRONTIER-TECH</text>
    <rect x="180" y="128" width="170" height="3.5" rx="1.5" fill="#F07832" />
  </g>

  <!-- 4. Hack UP Official Icon Badge & Header Text Lockup -->
  <g id="hackUpBadge">
    <path d="{badge_navy}" fill="#102A43" fill-rule="evenodd" />
    <path d="{badge_orange}" fill="#F07832" fill-rule="evenodd" />
    <path d="{badge_green}" fill="#169855" fill-rule="evenodd" />
    <text x="990" y="96" class="font-tech" font-size="44" font-weight="900" fill="#102A43" letter-spacing="-0.02em">HACK</text>
    <text x="990" y="128" class="font-tech" font-size="20" font-weight="800" fill="#102A43" letter-spacing="0.08em">UTTAR PRADESH</text>
    <text x="990" y="158" class="font-tech" font-size="21" font-weight="900" fill="#169855" letter-spacing="0.14em">2026</text>
  </g>

  <!-- 5. Main Hero Typography -->
  <g id="mainHeadline">
    <text x="74" y="340" class="font-tech" font-size="172" font-weight="900" fill="#102A43" letter-spacing="-0.04em">HACK</text>
    <text x="78" y="468" class="font-tech" font-size="68" font-weight="900" fill="#102A43" letter-spacing="-0.02em">UTTAR PRADESH</text>
    
    <!-- 2026 Chevron Arrow Ribbon -->
    <polygon points="78,518 255,518 290,546 255,574 78,574" fill="#F07832" />
    <text x="108" y="557" class="font-tech" font-size="30" font-weight="900" fill="#102A43" letter-spacing="0.04em">2026</text>
    
    <!-- Code / Create / Change Slogan -->
    <text x="320" y="556" class="font-tech" font-size="23" font-weight="800" fill="#102A43" letter-spacing="0.08em">CODE / CREATE / CHANGE</text>
  </g>

  <!-- 6. Bottom Left Sub-kicker -->
  <g id="bottomKicker">
    <line x1="78" y1="630" x2="680" y2="630" stroke="#102A43" stroke-width="2.2" opacity="0.85" />
    <circle cx="88" cy="668" r="8" fill="#169855" />
    <text x="108" y="675" class="font-tech" font-size="21.5" font-weight="900" fill="#102A43" letter-spacing="0.05em">LOCAL CHALLENGES. WORLD-CLASS BUILDS.</text>
    <text x="78" y="718" class="font-tech" font-size="16.5" font-weight="800" fill="#169855" letter-spacing="0.18em">FROM UTTAR PRADESH, BUILDING FOR BHARAT</text>
  </g>

  <!-- 7. Right Graphic: Saffron Sun Halo + 3D Isometric Laptop -->
  <g id="laptopIllustration">
    <!-- Halftone Sun Circle -->
    <circle cx="1140" cy="420" r="235" fill="#F07832" />
    <circle cx="1140" cy="420" r="235" fill="url(#dotPattern)" />

    <!-- 3D Ground Perspective Shadow -->
    <polygon points="730,614 770,638 1350,606 1385,580 818,570" fill="#0C1B2A" opacity="0.28" />

    <!-- Laptop Screen Outer Shell -->
    <polygon points="806,218 1284,196 1296,548 818,570" fill="#102A43" stroke="#0C1B2A" stroke-width="4.5" stroke-linejoin="round" />

    <!-- Laptop Inner Display Terminal -->
    <polygon points="824,264 1266,244 1276,532 834,552" fill="#0B1622" stroke="#16293D" stroke-width="2" />

    <!-- Terminal Subtle Perspective Grid Lines -->
    <line x1="826" y1="290" x2="1272" y2="270" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="326" x2="1272" y2="306" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="362" x2="1272" y2="342" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="398" x2="1272" y2="378" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="434" x2="1272" y2="414" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="470" x2="1272" y2="450" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="826" y1="506" x2="1272" y2="486" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    
    <line x1="880" y1="260" x2="892" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="930" y1="260" x2="942" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="980" y1="260" x2="992" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="1030" y1="260" x2="1042" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="1080" y1="260" x2="1092" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="1130" y1="260" x2="1142" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="1180" y1="260" x2="1192" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />
    <line x1="1230" y1="260" x2="1242" y2="540" stroke="#1E3852" stroke-width="1.2" opacity="0.38" />

    <!-- Browser Window Control Dots -->
    <circle cx="838" cy="242" r="5.5" fill="#F07832" />
    <circle cx="858" cy="241" r="5.5" fill="#FFC50F" />
    <circle cx="878" cy="240" r="5.5" fill="#169855" />
    <text x="906" y="246" class="font-tech" font-size="13.5" font-weight="700" fill="#7A9BB8">build.local / up-2026</text>

    <!-- Central Hero Code Symbol: < / > -->
    <polyline points="956,334 892,392 956,450" fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="1084" y1="316" x2="1018" y2="456" stroke="#F07832" stroke-width="18" stroke-linecap="round" />
    <circle cx="1022" cy="448" r="9.5" fill="#169855" stroke="#FFFFFF" stroke-width="3" />
    <polyline points="1136,326 1200,380 1136,438" fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Syntax Code Line Bars -->
    <rect x="888" y="482" width="76" height="8" rx="4" fill="#F07832" />
    <rect x="976" y="481" width="130" height="8" rx="4" fill="#169855" />
    <rect x="1118" y="479" width="46" height="8" rx="4" fill="#F07832" />

    <rect x="888" y="504" width="124" height="8" rx="4" fill="#169855" />
    <rect x="1024" y="502" width="86" height="8" rx="4" fill="#F07832" />
    <rect x="1122" y="500" width="38" height="8" rx="4" fill="#169855" />

    <rect x="888" y="524" width="56" height="8" rx="4" fill="#F07832" />
    <rect x="956" y="523" width="94" height="8" rx="4" fill="#169855" />

    <!-- Keyboard Base Deck Top Deck (Crisp White with Navy Outlines) -->
    <polygon points="740,610 1374,582 1296,548 818,570" fill="#FFFFFF" stroke="#0C1B2A" stroke-width="4.5" stroke-linejoin="round" />
    
    <!-- Base Bevel Edge -->
    <polygon points="740,610 770,628 1344,598 1374,582" fill="#E4DDD3" stroke="#0C1B2A" stroke-width="3.5" stroke-linejoin="round" />
    
    <!-- Saffron Orange Trackpad -->
    <polygon points="985,594 1120,588 1114,606 990,612" fill="#F07832" opacity="0.9" stroke="#0C1B2A" stroke-width="1.8" />
  </g>

  <!-- 8. Bottom Right Tracks Text & Tricolor Color Swatches -->
  <g id="bottomRightMeta">
    <text x="774" y="674" class="font-tech" font-size="19" font-weight="900" fill="#102A43" letter-spacing="0.08em">AI &amp; LANGUAGE / ODOP / AGRITECH / CIVIC TECH</text>
    <rect x="1296" y="728" width="44" height="10" rx="2" fill="#F07832" />
    <rect x="1342" y="728" width="44" height="10" rx="2" fill="#102A43" />
    <rect x="1388" y="728" width="12" height="10" rx="2" fill="#169855" />
  </g>
</svg>
'''

with open('new_website/assets/banner_vector.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open('new_website/assets/banner.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Successfully generated banner_vector.svg and banner.svg ({len(svg_content)} bytes)")
