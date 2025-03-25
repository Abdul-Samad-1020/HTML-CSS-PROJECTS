document.getElementById('convertBtn').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const imageFiles = document.getElementById('imageInput').files;
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (imageFiles.length > 0) {
        progressContainer.style.display = 'block'; // Show progress bar
        const doc = new jsPDF('p', 'mm', 'a4');
        let count = 0;

        for (let i = 0; i < imageFiles.length; i++) {
            await new Promise((resolve, reject) => {
                const file = imageFiles[i];
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = new Image();
                    img.src = event.target.result;

                    img.onload = function () {
                        const imgWidth = doc.internal.pageSize.getWidth();
                        const imgHeight = (img.height * imgWidth) / img.width;

                        if (imgHeight > doc.internal.pageSize.getHeight()) {
                            doc.addImage(img, 'JPEG', 0, 0, imgWidth, doc.internal.pageSize.getHeight());
                        } else {
                            doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                        }

                        if (i < imageFiles.length - 1) {
                            doc.addPage();
                        }

                        // Update progress bar
                        count++;
                        const progress = (count / imageFiles.length) * 100;
                        progressBar.style.width = `${progress}%`;

                        resolve();
                    };
                };

                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        const pdfBlob = doc.output('blob');
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'converted.pdf';
        downloadLink.style.display = 'block';

        downloadLink.addEventListener('click', function () {
            resetInput();
        });

        document.getElementById('convertBtn').style.display = 'none';
        document.getElementById('refreshBtn').style.display = 'inline-block';
        progressContainer.style.display = 'none'; // Hide progress bar
    } else {
        alert('Please select image files.');
    }
});

document.getElementById('refreshBtn').addEventListener('click', function () {
    resetInput();
});

function resetInput() {
    document.getElementById('imageInput').value = '';
    document.getElementById('convertBtn').style.display = 'inline-block';
    document.getElementById('downloadLink').style.display = 'none';
    document.getElementById('refreshBtn').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('fileCount').style.display = 'none';
}

document.getElementById('imageInput').addEventListener('change', function() {
    const fileCount = this.files.length;
    const fileCountElement = document.getElementById('fileCount');

    if (fileCount > 0) {
        fileCountElement.textContent = `${fileCount} file(s) selected`;
        fileCountElement.style.display = 'block';
    } else {
        fileCountElement.textContent = 'No files selected';
    }
});
