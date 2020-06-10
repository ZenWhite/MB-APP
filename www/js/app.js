window.addEventListener('DOMContentLoaded', () => {
    //Main Meme Circle Class
    class Meme {
        constructor(options) {
            this.options = options;
            this.el = document.createElement('div');
            this.events();
        }
        render() {
            this.el.classList.add('options-page__item', 'meme');
            this.el.id = this.options.id;
            this.el.style.background = `url(${this.options.image}) no-repeat center center/100% 100%`;
            return this.el;
        }
        events() {
            document.body.addEventListener('click', ({
                target
            }) => {
                if (target.classList.contains('meme')) {
                    Meme.setActiveMeme(target.id);
                }
            });
        }
        static setActiveMeme(id) {
            const prev = document.querySelector('.active');
            const el = document.querySelector(`.meme[id="${id}"]`);
            const meme = memes.get(id.toString());

            if (prev) prev.classList.remove('active');
            el.classList.add('active');

            document.body.style.background = `url(${meme.image}) no-repeat center center, rgba(39,39,39,0.9)`;
            document.body.style.backgroundSize = 'cover';
            memeName.textContent = meme.name;

            audio.src = meme.audio;
        }
    }

    //Main Memes Container
    const memes = new Map();
    const audio = document.getElementById('audio');

    //UI
    const play = document.querySelector('.play');
    const memeGrid = document.querySelector('.options-page__block');
    const mainBlock = document.querySelector('main');
    const memeName = document.querySelector('.name');

    //Events
    play.addEventListener('click', onPlayBtnClick);

    (async () => { //Main Module. Rendering Memes Circles and set meme in memes
        try {
            await getMemes().then(data => {
                data.memes.forEach(dataItem => memes.set(dataItem.id, dataItem));
            });
            renderMemes();
        } catch (err) {
            console.log(err);
        }
    })();

    async function getMemes() { //Get Memes From JSON File(My Fake Database)
        try {
            const response = await fetch('memes.json');
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    function renderMemes() {
        const wrap = document.createElement('div');
        wrap.classList.add('wrap');

        memes.forEach((memesItem) => {
            const meme = new Meme(memesItem);
            const memeBlock = meme.render();
            wrap.appendChild(memeBlock);
        });

        memeGrid.appendChild(wrap);
        Meme.setActiveMeme(1);
    }

    function onPlayBtnClick(e) {
        e.preventDefault();
        this.classList.add('animate');
        setTimeout(() => {
            this.classList.remove('animate');
        }, 1000);
        audio.play();
    }

    //Swipe
    let touchstartX = 0;
    let touchendX = 0;

    mainBlock.addEventListener('touchstart', e => {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    mainBlock.addEventListener('touchend', e => {
        touchendX = event.changedTouches[0].screenX;
        onTouchHandler();
    }, false); 

    function onTouchHandler() {
        const children = mainBlock.children[0];
        if (touchendX <= touchstartX) {
           if(!children.classList.contains('swipe')) children.classList.add('swipe');
        }
        if (touchendX >= touchstartX) {
            if(children.classList.contains('swipe')) children.classList.remove('swipe');
        }
    }
});