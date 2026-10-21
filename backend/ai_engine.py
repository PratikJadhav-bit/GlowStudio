"""
GlowStudio – AI Recommendation Engine
Analyzes beauty profile and returns personalized style recommendations.
"""
from typing import Optional


RECOMMENDATIONS_DB = {
    # face_shape -> hairstyle recommendations
    "Oval": [
        {
            "title": "Soft Layers with Face-Framing Pieces",
            "category": "hairstyle",
            "icon": "✂️",
            "confidence": 97,
            "desc": "Your oval face shape is the most versatile — soft layers with face-framing highlights will enhance your natural symmetry beautifully.",
            "service": "Signature Cut & Style",
            "stylist_match": "Sophia Laurent"
        },
        {
            "title": "Balayage Caramel Highlights",
            "category": "color",
            "icon": "🎨",
            "confidence": 94,
            "desc": "Warm caramel balayage will complement your skin tone and add dimensional depth to your hair.",
            "service": "Balayage Color Treatment",
            "stylist_match": "Isabella Chen"
        },
    ],
    "Round": [
        {
            "title": "Long Layers with Side-Swept Bangs",
            "category": "hairstyle",
            "icon": "✂️",
            "confidence": 96,
            "desc": "Elongating layers and side-swept bangs create the illusion of length, perfectly balancing your round face shape.",
            "service": "Precision Cut & Blowout",
            "stylist_match": "Marcus Webb"
        },
        {
            "title": "Cool Ash Tone Color",
            "category": "color",
            "icon": "🎨",
            "confidence": 91,
            "desc": "Cool ash tones help slim the appearance of rounder faces while giving a sophisticated, editorial look.",
            "service": "Full Color Service",
            "stylist_match": "Isabella Chen"
        },
    ],
    "Square": [
        {
            "title": "Soft Waves with Curtain Bangs",
            "category": "hairstyle",
            "icon": "✂️",
            "confidence": 95,
            "desc": "Soft, flowing waves soften a strong jaw line. Curtain bangs add femininity and draw attention to your eyes.",
            "service": "Wave Texture Treatment",
            "stylist_match": "Sophia Laurent"
        },
        {
            "title": "Rose Gold Dimensional Color",
            "category": "color",
            "icon": "🎨",
            "confidence": 93,
            "desc": "Rose gold tones soften angular features and add warmth, creating a stunning, high-fashion look.",
            "service": "Rose Gold Gloss Treatment",
            "stylist_match": "Isabella Chen"
        },
    ],
    "Heart": [
        {
            "title": "Chin-Length Bob with Volume",
            "category": "hairstyle",
            "icon": "✂️",
            "confidence": 94,
            "desc": "A chin-length bob adds width to the lower face, perfectly balancing a wider forehead and creating elegant symmetry.",
            "service": "Sculpted Bob Cut",
            "stylist_match": "Marcus Webb"
        },
        {
            "title": "Warm Honey Highlights",
            "category": "color",
            "icon": "🎨",
            "confidence": 92,
            "desc": "Honey-warm highlights add warmth to your complexion and draw the eye downward, beautifully framing your features.",
            "service": "Highlights & Toning",
            "stylist_match": "Sophia Laurent"
        },
    ],
    "Diamond": [
        {
            "title": "Side-Parted Sleek Layers",
            "category": "hairstyle",
            "icon": "✂️",
            "confidence": 96,
            "desc": "Side-parted sleek layers minimize cheekbone width while enhancing your naturally striking features.",
            "service": "Layered Precision Cut",
            "stylist_match": "Sophia Laurent"
        },
        {
            "title": "Dark Chocolate Base with Highlights",
            "category": "color",
            "icon": "🎨",
            "confidence": 90,
            "desc": "A deep chocolate base with strategic highlights creates dimension and softens the angular cheekbones.",
            "service": "Color & Highlight Service",
            "stylist_match": "Isabella Chen"
        },
    ],
}

HAIR_TYPE_RECOMMENDATIONS = {
    "Straight": {
        "title": "Keratin Smoothing Treatment",
        "category": "treatment",
        "icon": "💎",
        "confidence": 93,
        "desc": "Enhance your naturally straight hair with a professional keratin treatment for mirror-like shine and frizz control.",
        "service": "Keratin Treatment",
    },
    "Wavy": {
        "title": "Curl Definition & Moisture Boost",
        "category": "treatment",
        "icon": "🌊",
        "confidence": 95,
        "desc": "A professional curl definition treatment will enhance your natural wave pattern and lock in long-lasting moisture.",
        "service": "Wave Enhancement Treatment",
    },
    "Curly": {
        "title": "DevaCurl Specialty Cut",
        "category": "treatment",
        "icon": "🌀",
        "confidence": 97,
        "desc": "Our curl specialist will use the DevaCurl method to cut and style your curls dry, preserving your natural curl pattern.",
        "service": "Curly Hair Specialist Cut",
    },
    "Coily": {
        "title": "Deep Moisture & Stretch Treatment",
        "category": "treatment",
        "icon": "🔁",
        "confidence": 96,
        "desc": "A deep conditioning and elongation treatment to hydrate, define, and celebrate your beautiful coily texture.",
        "service": "Moisture & Strength Treatment",
    },
}

STYLE_VIBE_PRODUCTS = {
    "Classic": [
        {"name": "Olaplex No.3 Hair Perfector", "icon": "🧴", "price": 28},
        {"name": "Moroccanoil Treatment", "icon": "✨", "price": 34},
    ],
    "Boho": [
        {"name": "SheaMoisture Curl Enhancing Smoothie", "icon": "🌿", "price": 16},
        {"name": "Not Your Mother's Curl Talk", "icon": "🌸", "price": 12},
    ],
    "Edgy": [
        {"name": "Kenra Platinum Silkening Mist", "icon": "⚡", "price": 22},
        {"name": "Redken One United Multi-Benefit", "icon": "🖤", "price": 26},
    ],
    "Romantic": [
        {"name": "Kérastase Elixir Ultime Oil", "icon": "🌹", "price": 52},
        {"name": "Bumble & Bumble Hairdresser's Invisible Oil", "icon": "💐", "price": 42},
    ],
}


def generate_recommendations(
    face_shape: str,
    hair_type: str,
    style_vibe: str,
    skin_tone: Optional[str] = None
) -> dict:
    """
    Core AI recommendation engine.
    Returns personalized beauty recommendations based on profile attributes.
    """
    recs = []

    # Face shape recommendations
    face_recs = RECOMMENDATIONS_DB.get(face_shape, RECOMMENDATIONS_DB["Oval"])
    recs.extend(face_recs)

    # Hair type treatment
    hair_rec = HAIR_TYPE_RECOMMENDATIONS.get(hair_type, HAIR_TYPE_RECOMMENDATIONS["Wavy"])
    hair_rec["stylist_match"] = "Sophia Laurent"
    recs.append(hair_rec)

    # Product suggestions based on style vibe
    products = STYLE_VIBE_PRODUCTS.get(style_vibe, STYLE_VIBE_PRODUCTS["Classic"])

    # Skincare tip
    skincare_tip = {
        "title": "Hydrating Glow Facial",
        "category": "skincare",
        "icon": "🌟",
        "confidence": 89,
        "desc": "Our signature hyaluronic acid infusion facial is perfectly suited to enhance and complement your natural complexion.",
        "service": "Luxury Glow Facial",
        "stylist_match": "Isabella Chen"
    }
    recs.append(skincare_tip)

    return {
        "recommendations": recs,
        "profile_summary": {
            "face_shape": face_shape,
            "hair_type": hair_type,
            "style_vibe": style_vibe,
            "match_score": 94,
        },
        "suggested_products": products,
        "top_stylist": "Sophia Laurent",
    }
