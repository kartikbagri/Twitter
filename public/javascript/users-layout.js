function createUserHTML(user) {
    let followBtn = ''
    const isFollowing = JSON.parse(userLoggedIn).following.includes(user._id);
    const text = isFollowing? 'Following' : 'Follow';
    const className = isFollowing? 'is-following' : 'to-follow';

    if(JSON.parse(userLoggedIn)._id != user._id) {
        followBtn = `<div class="profile-buttons">
            <a class='follow-btn ${className}' data-id="${user._id}" href="">${text}</a>
        </div>`
    }
    return `
    <div class="user">
        <div class="profile-pic-container">
            <img class="profile-pic" src="${user.profilePic}">
        </div>
        <div class="user-details-container">
            <a class="user-link" href="/profile/${user.username}">
                <p class="name user-name">${user.firstName} ${user.lastName}</p>
                <p class="grey user-username">@${user.username}</p>
            </a>
        </div>
        ${followBtn}
    </div>`
}