document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('upload-form');
    const progressContainer = document.getElementById('progress-container');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const videoInput = document.getElementById('video');

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(uploadForm);
        progressContainer.classList.remove('hidden');
        progressText.textContent = 'Uploading...';
        progressBar.style.width = '0%';

        fetch('/upload', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => {
                progressText.textContent = 'Converting...';
                // Симулируем этап конвертации
                setTimeout(() => {
                    progressText.textContent = 'Completed!';
                    progressBar.style.width = '100%';
                    window.location.href = `/download/${data.filename}`;
                    // Очистка input и прогресс-бара после завершения
                    setTimeout(() => {
                        uploadForm.reset();
                        progressContainer.classList.add('hidden');
                        progressBar.style.width = '0%';
                        progressText.textContent = 'Uploading...';
                    }, 2000);
                }, 2000);
            }).catch(error => {
                console.error('Error:', error);
                progressText.textContent = 'An error occurred. Please try again.';
            });
    });
});
