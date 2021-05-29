function outputPosts(posts) {
    posts.forEach(function(post) {
        const html = createPost(post);
        document.querySelector('.post-container').insertAdjacentHTML('afterbegin', html);
    });
}


// For displaying the posts
function displayPosts() {
    $.get(`/api/posts/${postId}`, function(result) {
        document.querySelector('.post-container').innerHTML = "";
        outputPosts(result.replies);
        outputPosts(result.postData);
        if(result.replyTo) outputPosts([result.replyTo]);
    });
}

displayPosts();