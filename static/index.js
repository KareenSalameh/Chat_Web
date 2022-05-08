var numberOfUsers = 5;
var newUsers = [];
var currentUser;

const exists = function (user, users) {
    return users.some(u => u.name === user);
}

const empty = function(id) {
    let submit = document.getElementById(id);
    submit.value = '';
}

const time = function() {
    var d = new Date();
    var hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
    var minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return hour + ':' + minutes;
}

const checkRecipient = function(user, users) {
    if (user && !exists(user, users)) {
        addRecipient(user);
    }
    empty('floatingInputValue');
}

const updateLastMessage = function(user, lastMessage) {
    lastMessage.innerHTML = '<br>';

    if (user.lastMessage === "text") {
        lastMessage.innerHTML += user.chat.rec4.slice(0, 20);
        lastMessage.innerHTML = lastMessage.innerHTML.replace("<br><span>","");
        lastMessage.innerHTML = lastMessage.innerHTML.replace("</span>", "");
        lastMessage.innerHTML = lastMessage.innerHTML.replace(new RegExp("[0-9]", "g"), "");
        lastMessage.innerHTML = lastMessage.innerHTML.replace(":", "");
        lastMessage.innerHTML += "...";
    } else {
        lastMessage.innerHTML += user.lastMessage;
    }
}

const uploadImage = function() {
    $('#modalUploadImage').modal("show");
}

const uploadVideo = function() {
    $('#modalUploadVideo').modal("show");
}

const uploadRecording = function() {
    $('#modalUploadRecording').modal("show");
}

const buttons = function() {
    let div = document.getElementById('chat');

    let toolbar = document.createElement('div');
    toolbar.className = "btn-toolbar position-absolute bottom-0 start-0";
    toolbar.ariaRoleDescription = "toolbar";
    toolbar.id = "toolbar";

    let group = document.createElement('div');
    group.className = "btn-group me-2";
    group.ariaRoleDescription = "group";

    // image
    let image = document.createElement('button');
    image.className = "btn btn-info";
    image.onclick = uploadImage;
    // image.formTarget = "#modalSubscriptionForm";
    // image.id = "img";
    let i1 = document.createElement('i');
    i1.className = "bi bi-file-image";

    image.appendChild(i1);
    group.appendChild(image);

    // video
    let video = document.createElement('button');
    video.className = "btn btn-info";
    video.onclick = uploadVideo;
    // video.id = "vid";
    let i2 = document.createElement('i');
    i2.className = "bi bi-file-play";

    video.appendChild(i2);
    group.appendChild(video);

    // voice recorder
    let recorder = document.createElement('button');
    recorder.className = "btn btn-info";
    recorder.onclick = uploadRecording;
    // recorder.id = "rec";
    let i3 = document.createElement('i');
    i3.className = "bi bi-file-music";
    // i3.className = "bi bi-mic";

    recorder.appendChild(i3);
    group.appendChild(recorder);

    // location (not to be used)
    let location = document.createElement('button');
    location.className = "btn btn-info";
    let i4 = document.createElement('i');
    i4.className = "bi bi-geo";

    location.appendChild(i4);
    group.appendChild(location);

    // close
    let close = document.createElement('button');
    close.className = "btn btn-info btn-close";
    close.onclick = function() {
        toolbar.innerHTML = '';
    }

    group.append(close);

    toolbar.appendChild(group);
    div.appendChild(toolbar);
}

// return 1 if the message is not empty
const sendMessage = function(message, chatbox, bool = true) {
    if (message != "") {
        let m = document.createElement('div');

        if (bool) {
            m.className = "message myMsg";
        } else {
            m.className = "message recMsg";
        }
        
        let p = document.createElement('p');
        p.innerHTML = message;
        m.appendChild(p);
        chatbox.appendChild(m);

        return 1;
    }

    return 0;
}

const sendNewMessage = function(user, message, chatbox) {
    let i = 0;
    if (!$.isEmptyObject(user.newMessages)) {
        i = Object.keys(user.newMessages).length;
    }

    let sent = sendMessage(message, chatbox);
    if (sent) {
        user.newMessages['' + i] = message;
        currentUser.lastMessage = "text";
    }
}

const displayInnerChat = function(user) {
    let chat = document.getElementById('chat');
    let div = document.createElement('div');
    div.className = "chat-messages p-4";
    div.id = "inner";
    let chatbox = document.createElement('div');
    chatbox.className = "chatbox card-text";
    chatbox.id = "chatbox";

    sendMessage(user.chat.rec1, chatbox);
    sendMessage(user.chat.sent, chatbox, false);
    sendMessage(user.chat.rec2, chatbox);
    sendMessage(user.chat.rec3, chatbox);
    sendMessage(user.chat.rec4, chatbox);

    if (!$.isEmptyObject(user.newMessages)) {
        for (let num of Object.keys(user.newMessages)) {
            sendMessage(user.newMessages[num], chatbox);
        }
    }
    div.appendChild(chatbox);
    chat.appendChild(div);
}

const displayChat = function(user) {
    let div = document.getElementById('chat');
    div.innerHTML = "";
    currentUser = user;

    // top
    let lt = document.createElement('li');
    lt.className = "list-group-item d-flex align-items-center position-absolute top-0 start-0";
    lt.id = "top";

    let im = document.createElement('img');
    im.src = user.img;
    im.className = "userimage";

    let sp = document.createElement('span');
    sp.className = "w-100 m-1 ms-4";
    sp.innerHTML = user.nickname;

    // middle
    displayInnerChat(user);

    // bottom
    let db = document.createElement('div');
    db.className = "input-group mb-3 position-absolute bottom-0 start-0";
    db.id = "bottom";

    let button = document.createElement('button');
    button.className = "btn btn-outline-info";
    button.type = "button";
    button.id = "b-input";
    button.onclick = buttons;
    
    let i1 = document.createElement('i');
    i1.className = "bi bi-file-plus";

    let input = document.createElement('input');
    input.type = "text";
    input.className = "form-control";
    input.ariaRoleDescription = "b-input";

    let send = document.createElement('button');
    send.className = "btn btn-outline-dark";
    send.type = "button";
    send.innerHTML = "Send";
    send.onclick = function() {
        if (input.value != "") {
            let chat = document.getElementById('chatbox');
            sendNewMessage(user, input.value + '<br><span>' + time() + '</span>', chat);
            input.value = '';
        }
        
    }

    button.appendChild(i1);
    db.appendChild(button);
    db.appendChild(input);
    db.appendChild(send);
    lt.appendChild(im);
    lt.appendChild(sp);
    div.appendChild(lt);
    inner.appendChild(db);
}

const addRecipient = function(user) {
    if (!user) {
        return;
    }

    if (!(typeof user === 'object')) {
        if (exists(user, newUsers)) {
            return;
        }
        user = { name: user, nickname: user, img: "/static/images/icon.png", password: "12345", id: ++numberOfUsers, chat: {rec1: "", sent: "", rec2: "", rec3: "", rec4: ""}, newMessages: {}, lastMessage: "" }
        newUsers.push(user);
        
    }

    let ul = document.getElementById('lst');
    let li = document.createElement('li');
    li.className = "list-group-item d-flex align-items-top";

    li.onclick = function () {
        displayChat(user);
    }

    let img = document.createElement('img');
    img.src = user.img;
    img.className = "userimage";

    let span = document.createElement('span');
    span.innerHTML = user.nickname;

    let lastMessage = document.createElement('span');
    lastMessage.class = "d-flex align-items-bottom fw-lighter";
    lastMessage.id = "lastMessage";
    updateLastMessage(user, lastMessage);
    

    let cite = document.createElement('cite');
    cite.className = "w-100 ms-5";
    cite.title = "Source Title";
    cite.innerHTML = "1 minute ago"; // need to be changed whenever a new recipient is being added!

    li.appendChild(img);
    span.appendChild(lastMessage);
    li.appendChild(span);
    li.appendChild(cite);
    ul.appendChild(li);
}