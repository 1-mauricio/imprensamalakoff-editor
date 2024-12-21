let quill;



document.addEventListener('DOMContentLoaded', function() {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'font': fonts }],
                [{ 'header': [1, 2, 3, false] }],
                ['font'],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block', 'link'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }]
            ]
        },
        formats: ['font'],
    });
});
