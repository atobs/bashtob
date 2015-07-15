# Installation

    sudo npm install -g bashtob

# Installation from source

    git clone http://github.com/atobs/bashtob
    cd bashtob
    # install dependencies
    npm install 
    # make symlinks for our binaries
    sudo npm link 

    # to update (later)
    git pull 

## bashtob

view posts on boards:

    bashtob # see recent posts
    bashtob /b # see posts on B
    bashtob 33000 # see short post
    bashtob 33000! # see full post

## writetob

write posts or replies on boards

    # write a new post
    writetob /b

    # write a new reply
    writetob 33000

## tailtob

subscribe to see new replies and updates happening on atob

    tailtob
    # only watch /b
    tailtob /b
    # only watch post 33000 
    tailtob 33000
