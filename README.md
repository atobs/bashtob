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

    bashtob /b
    bashtob 33000
    bashtob 33000!

## writetob

write posts or replies on boards

    writetob /b
    writetob 33000

## tailtob

subscribe to see new replies and updates happening on atob

    tailtob
    tailtob /b
    tailtob 33000
