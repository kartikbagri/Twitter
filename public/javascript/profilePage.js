let cropper;

// Getting the posts (By default)
function loadPosts() {
    $.get(`/api/posts/${profileUserId}/posts`, function(posts) {
        document.querySelector('.post-container').innerHTML = "";
        outputPosts(posts);
    });
}

// Adding event listener to replies tab
document.getElementById('tabReplies').addEventListener('click', function() {
    document.getElementById('tabReplies').classList.add('active-tab');
    document.getElementById('tabPosts').classList.remove('active-tab');
    loadReplies();
})


// Adding event listener to posts tab
document.getElementById('tabPosts').addEventListener('click', function() {
    document.getElementById('tabReplies').classList.remove('active-tab');
    document.getElementById('tabPosts').classList.add('active-tab');
    loadPosts();
})


// Getting the replies
function loadReplies() {
    $.get(`/api/posts/${profileUserId}/replies`, function(posts) {
        document.querySelector('.post-container').innerHTML = "";
        outputPosts(posts);
    });
}


// Outputing the posts
function outputPosts(posts) {
    posts.forEach(function(post) {
        const html = createPost(post);
        document.querySelector('.post-container').insertAdjacentHTML('afterbegin', html);
    });
}


// Display Posts
function displayPosts() {
    const tab = document.querySelector('.active-tab').id;
    if(tab === 'tabPosts') {
        loadPosts();
    } else {
        loadReplies();
    }
}


// Modals Opening
function openPicModal(modalName) {
    document.querySelector('.backdrop').classList.add('modal-show');
    document.getElementById(`${modalName}Modal`).classList.add('modal-show');
}


// Modals Closing
function closePicModal(modalName) {
    document.getElementById(`${modalName}Modal`).classList.add('slide-up');
    setTimeout(function() {
        document.querySelector('.backdrop').classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('slide-up');
    }, 150);
}


// Change Profile Pic
document.querySelector('.change-profile-pic')?.addEventListener('click', function() {
    openPicModal('profilePic')
})


$('#profilePhoto').change(function() {
    if(this.files && this.files[0]) {
        const image = document.getElementById('profilePhotoPreview')
        const reader = new FileReader();
        reader.onload = function(e) {
            image.setAttribute('src', e.target.result);
            if(cropper !== undefined) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false,
            });
        }
        reader.readAsDataURL(this.files[0]);
    }
})


// Closing Profile Pic Modal
document.getElementById('profilePicCloseModal')?.addEventListener('click', function() {
    closePicModal('profilePic');
})


// Change Cover Photo
document.querySelector('.change-cover-pic')?.addEventListener('click', function() {
    openPicModal('coverPhoto');
})


/ // Closing Cover Photo Modal
document.getElementById('coverPhotoCloseModal')?.addEventListener('click', function() {
    closePicModal('coverPhoto');
})


loadPosts();