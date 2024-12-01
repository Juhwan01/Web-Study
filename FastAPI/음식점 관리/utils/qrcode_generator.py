import qrcode
from io import BytesIO
import base64

def generate_queue_qr(queue_number: str, base_url: str) -> str:
    """
    대기열 QR 코드 생성
    base_url: 프론트엔드 URL (예: "https://restaurant.com/queue/")
    """
    # QR 코드에 담길 URL 생성
    qr_url = f"{base_url}{queue_number}"
    
    # QR 코드 이미지 생성
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # 이미지를 base64로 변환
    buffered = BytesIO()
    qr_image.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return qr_base64