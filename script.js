const form = document.getElementById('qrForm');
const qrcodeDiv = document.getElementById('qrcode');
const dataInput = document.getElementById('data');
const imageInput = document.getElementById('imageInput');

document.addEventListener('DOMContentLoaded', () => {

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const data = dataInput.value;

		// Check if QRCode library is loaded
		if (typeof QRCode === 'undefined') {
			alert('QRCode library not loaded. Please refresh the page.');
			return;
		}

		qrcodeDiv.innerHTML = '';

		// Check if user selected an image
		if (imageInput.files && imageInput.files[0]) {
			const file = imageInput.files[0];

			const reader = new FileReader();

			reader.onload = (event) => {
				const imageData = event.target.result;

				// Create temporary container for QR code
				const tempContainer = document.createElement('div');

				const qrcode = new QRCode(tempContainer, {
					text: data,
					correctLevel: QRCode.CorrectLevel.H
				});

				// Wait for QR code to be generated
				setTimeout(() => {
					const qrCanvas = tempContainer.querySelector('canvas');

					// Create new canvas for final result
					const finalCanvas = document.createElement('canvas');
					finalCanvas.width = qrCanvas.width;
					finalCanvas.height = qrCanvas.height;

					// Get drawing context
					const ctx = finalCanvas.getContext('2d');

					// Copy QR code to final canvas
					ctx.drawImage(qrCanvas, 0, 0);

					const img = new Image();

					img.onload = () => {
						const logoSize = finalCanvas.width * 0.3;

						const x = (finalCanvas.width - logoSize) / 2;
						const y = (finalCanvas.height - logoSize) / 2;

						ctx.fillStyle = 'white';
						ctx.fillRect(x - 2, y - 2, logoSize + 4, logoSize + 4);
						ctx.drawImage(img, x, y, logoSize, logoSize);
						qrcodeDiv.appendChild(finalCanvas);

					};

					// Set logo source
					img.src = imageData;

				}, 200);
			};
			reader.readAsDataURL(file);

		} else {
			const qrcode = new QRCode(qrcodeDiv, {
				text: data,
				correctLevel: QRCode.CorrectLevel.H
			});

			console.log('Simple QR Code generated!');
		}

		// button download
		const downloadButton = document.createElement('button');
		downloadButton.innerHTML = '<i class="ri-download-2-line"></i> Download QR Code';
		qrcodeDiv.appendChild(downloadButton);

		downloadButton.addEventListener('click', () => {
			let canvas;
			if (qrcodeDiv.querySelector('canvas')) {
				canvas = qrcodeDiv.querySelector('canvas');
			} else if (qrcodeDiv.querySelector('img')) {
				const img = qrcodeDiv.querySelector('img');
				canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
			}

			if (canvas) {
				const link = document.createElement('a');
				link.href = canvas.toDataURL('image/png');
				link.download = 'qrcode.png';
				link.click();
			}
		});
	});

});
