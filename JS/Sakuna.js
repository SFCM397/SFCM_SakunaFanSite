// ========================================
// ページ読み込み完了後に実行
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // 全ページ共通ヘッダー写真
        setupCommonHeader();

        // 最新の追加を自動取得
        loadRecentAdditions();

        // 共通ハンバーガーメニューを作成
        setupCommonMenu();

        // 最新ニュースを読み込む
        loadLatestNews();

        // 最新配信を読み込む
        loadLatestStream();

        // 最新MOVIEを読み込む
        loadLatestMovie();

        // 最新の他枠配信
        loadLatestOtherStream();

        // 配信チェックボタンを設定
        setupStreamButtons();

        // 前のページに戻るボタンを作成
        createBackButton();

        // 猫の足跡アニメーション
        startCatFootprints();

        setupStreamLinkButtons();



        // SEARCHページ
        await loadSearchItems();

        // SEARCHページの絞り込み
        setupSearchFilter();

        // DOMの準備と検索データ読み込み後に詳細検索を初期化
        setupDetailFilter();

        // 1文字入力するたびに検索結果を絞り込む
        setupTextSearch();

        setupSearchButton();


        // 最初は「すべて」なので詳細を隠す
        updateDetailButtons("all");

        // PLAYLISTページ
        setupPlaylist();
    }
);


// ========================================
// 共通ハンバーガーメニュー
// ========================================

function setupCommonMenu() {


    // ----------------------------------------
    // メニューを入れる場所
    // ----------------------------------------

    let quickMenu =
        document.getElementById("quickMenu");

    // ----------------------------------------
    // ハンバーガーボタン
    // ----------------------------------------
    let menuButton =
        document.querySelector(".menu-btn");

    // ハンバーガーボタンがないページでは処理を終了
    if (!quickMenu || !menuButton) {
        return;
    }

    // ----------------------------------------
    // 現在のページから
    // 各ページへの正しいURLを作成
    // ----------------------------------------

    const homeURL =
        new URL(
            "../HTML/SakunaTop.html",
            document.baseURI
        ).href;

    const newsURL =
        new URL(
            "../JUMPHTML/SakunaNews.html",
            document.baseURI
        ).href;

    const streamURL =
        new URL(
            "../JUMPHTML/SakunaStream.html",
            document.baseURI
        ).href;

    const movieURL =
        new URL(
            "../JUMPHTML/SakunaMovie.html",
            document.baseURI
        ).href;

    // 他枠配信ページ
    const otherStreamURL =
        new URL(
            "../JUMPHTML/SakunaOtherStream.html",
            document.baseURI
        ).href;

    const PlayListURL =
        new URL(
            "../JUMPHTML/SakunaPlaylist.html",
            document.baseURI
        ).href;

    // ----------------------------------------
    // メニュー内容
    // ----------------------------------------

    quickMenu.innerHTML = `

        <a href="${homeURL}">
            HOME
        </a>

        <a href="${newsURL}">
            NEWS
        </a>

        <a href="${streamURL}">
            STREAM
        </a>

        <a href="${movieURL}">
            MOVIE
        </a>

        <a href="${otherStreamURL}">
            OTHER CHANNEL
        </a>

        <a href="${PlayListURL}">
            PLAYLIST
        </a>

    `;

    // ----------------------------------------
    // 既存HTMLに onclick があっても
    // 二重実行されないように削除
    // ----------------------------------------

    menuButton.removeAttribute("onclick");

    // ----------------------------------------
    // メニュー開閉
    // ----------------------------------------

    menuButton.onclick =
        function () {

            // メニュー表示切替
            quickMenu.classList.toggle("active");

            // ボタンを×に変形
            menuButton.classList.toggle("active");

        };

}

// ========================================
// 検索ボタン
// ハンバーガーボタンの左に表示
// ========================================

function setupSearchButton() {

    // すでに検索ボタンがある場合は作らない
    if (document.querySelector(".search-button")) {
        return;
    }

    // 検索ページのURL
    const searchURL =
        new URL(
            "../JUMPHTML/SakunaSearch.html",
            document.baseURI
        ).href;

    // 検索ボタンを作成
    const searchButton =
        document.createElement("a");

    searchButton.className =
        "search-button";

    // 検索ページへ移動
    searchButton.href =
        searchURL;

    // 検索アイコンの写真を表示
    searchButton.innerHTML = `
        <img
            src="${new URL(
        "../JPG/検索アイコン.png",
        document.baseURI
    ).href}"
            alt="検索"
        >
    `;

    // bodyに追加
    document.body.appendChild(
        searchButton
    );
}


// ========================================
// 最新ニュースを自動表示
// ========================================

async function loadLatestNews() {

    // ニュース表示場所を取得
    const latestNews =
        document.getElementById("latest-news");

    // 最新ニュース表示場所がないページでは何もしない
    if (!latestNews) {
        return;
    }

    try {

        // ニュースページを読み込む
        const response =
            await fetch("../JUMPHTML/SakunaNews.html");

        // 読み込みに失敗した場合
        if (!response.ok) {

            throw new Error(
                "ニュースページを読み込めませんでした。"
                + " HTTP:"
                + response.status
            );

        }

        // HTMLを文字列として取得
        const html =
            await response.text();

        // HTMLを解析
        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        // news-cardを取得
        const newsCards =
            doc.querySelectorAll(
                ".news-card"
            );

        // ニュースが見つからなかった場合
        if (newsCards.length === 0) {

            latestNews.innerHTML =
                "<p>ニュース記事が見つかりませんでした。</p>";

            console.error(
                "news-cardが見つかりません。"
            );

            return;
        }

        // 最初の表示を消す
        latestNews.innerHTML = "";

        // 最新3件を表示
        newsCards.forEach(
            (card, index) => {

                if (index < 3) {

                    // カードをコピー
                    const copy =
                        card.cloneNode(true);

                    // トップページに追加
                    latestNews.appendChild(copy);
                }

            }
        );

        console.log(
            "ニュース読み込み成功！"
        );

        console.log(
            "取得したニュース数："
            + newsCards.length
        );

    } catch (error) {

        // エラー表示
        latestNews.innerHTML =
            "<p>ニュースを読み込めませんでした。</p>";

        console.error(
            "ニュース読み込みエラー：",
            error
        );

    }

}



// ========================================
// 前のページに戻るボタン
// ========================================

function createBackButton() {

    // ----------------------------------------
    // トップページかどうか確認
    // ----------------------------------------

    const currentPage =
        location.pathname.split("/").pop();


    // トップページの場合は
    // 「前のページ」ボタンを作らない
    if (currentPage === "SakunaTop.html") {
        return;
    }


    // ----------------------------------------
    // すでにボタンがある場合は作らない
    // ----------------------------------------

    if (document.querySelector(".back-button")) {
        return;
    }


    // ----------------------------------------
    // ボタンを作成
    // ----------------------------------------

    const button =
        document.createElement("button");

    button.className =
        "back-button";

    button.textContent =
        "← 前のページ";


    // ----------------------------------------
    // クリックしたら前のページへ戻る
    // ----------------------------------------

    button.onclick =
        function () {

            // ----------------------------------------
            // PLAYLISTページか確認
            // ----------------------------------------

            const currentPage =
                location.pathname.split("/").pop();


            // ----------------------------------------
            // PLAYLISTページの場合
            // ----------------------------------------

            if (currentPage === "SakunaPlaylist.html") {

                const result =
                    document.getElementById(
                        "playlist-result"
                    );


                // 再生リストの結果が表示中なら
                // PLAYLIST入口へ戻す
                if (
                    result &&
                    result.style.display !== "none"
                ) {

                    // 結果を隠す
                    result.style.display =
                        "none";


                    // 「配信」「動画」のカテゴリーを再表示
                    const playlistCategories =
                        document.querySelectorAll(
                            ".playlist-category"
                        );

                    playlistCategories.forEach(
                        function (section) {

                            section.style.display =
                                "";

                        }
                    );


                    // PLAYLISTのタイトルを再表示
                    const playlistTitle =
                        document.querySelector(
                            ".playlist-page > h2"
                        );

                    if (playlistTitle) {

                        playlistTitle.style.display =
                            "";

                    }


                    return;
                }
            }


            // ----------------------------------------
            // 通常ページ
            // ----------------------------------------

            history.back();

        };

    // ----------------------------------------
    // ページに追加
    // ----------------------------------------

    document.body.appendChild(button);

}


// ========================================
// 最新配信をトップページに表示
// ========================================

async function loadLatestStream() {

    // トップページの表示場所を取得
    const latestStream =
        document.getElementById("latest-stream");

    // トップページ以外では何もしない
    if (!latestStream) {
        return;
    }

    try {

        // 配信ページを読み込む
        const response =
            await fetch("../JUMPHTML/SakunaStream.html");

        // 読み込みに失敗した場合
        if (!response.ok) {
            throw new Error(
                "SakunaStream.htmlを読み込めませんでした"
            );
        }

        // HTMLを文字として取得
        const html =
            await response.text();

        // HTMLを解析
        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        // 配信カードを取得
        const streamCards =
            doc.querySelectorAll(".news-card");

        // 配信がない場合
        if (streamCards.length === 0) {

            latestStream.innerHTML =
                "<p>配信が見つかりませんでした。</p>";

            return;
        }

        // 「読み込み中」を削除
        latestStream.innerHTML = "";

        // 最新3件だけ表示
        streamCards.forEach(
            (card, index) => {

                if (index < 3) {

                    // 配信カードをコピー
                    const copy =
                        card.cloneNode(true);

                    // ====================================
                    // トップページではチェックボタンを削除
                    // ====================================

                    const actions =
                        copy.querySelector(".card-actions");

                    if (actions) {
                        actions.remove();
                    }

                    // トップページに追加
                    latestStream.appendChild(copy);
                }

            }
        );

        // ====================================
        // 配信ページ側のチェックボタンを設定
        // ====================================

        setupStreamButtons();

    }
    catch (error) {

        // エラー表示
        latestStream.innerHTML =
            "<p>配信を読み込めませんでした。</p>";

        console.error(
            "最新配信の読み込みエラー：",
            error
        );
    }
}

// ========================================
// 配信チェック機能
// ========================================

// チェック状態を保存する
function saveStreamStatus(id, type, checked) {

    // 保存用のキー
    const key =
        "sakuna_" + type + "_" + id;

    // localStorageに保存
    localStorage.setItem(
        key,
        checked ? "true" : "false"
    );
}


// 保存されている状態を取得
function getStreamStatus(id, type) {

    const key =
        "sakuna_" + type + "_" + id;

    return localStorage.getItem(key) === "true";
}


// ========================================
// チェックボタンを設定
// ========================================

function setupStreamButtons() {

    // 配信カードを取得
    const cards =
        document.querySelectorAll(
            ".news-card[data-stream-id]"
        );

    cards.forEach(function (card) {

        // 配信ID
        const id =
            card.dataset.streamId;

        // ボタンを取得
        const buttons =
            card.querySelectorAll(
                ".icon-btn"
            );

        buttons.forEach(function (button) {

            // ====================================
            // ボタンの種類を取得
            // ====================================

            let type =
                button.dataset.type;

            // data-typeがない場合
            // data-idの末尾から種類を取得
            //
            // 例：
            // 260831-watch
            // 260831-favorite
            // 260831-later
            //
            // ↓
            // watch
            // favorite
            // later

            if (!type && button.dataset.id) {

                if (
                    button.dataset.id.endsWith("-watch")
                ) {

                    type = "watch";

                }
                else if (
                    button.dataset.id.endsWith("-favorite")
                ) {

                    type = "favorite";

                }
                else if (
                    button.dataset.id.endsWith("-later")
                ) {

                    type = "later";

                }

            }

            // 種類が取得できなかった場合
            if (!type) {

                console.error(
                    "ボタンの種類を取得できません：",
                    button
                );

                return;
            }

            // 保存されている状態
            const checked =
                getStreamStatus(
                    id,
                    type
                );

            // 初期表示
            updateButton(
                button,
                type,
                checked
            );


            // ====================================
            // クリック
            // ====================================

            button.addEventListener(
                "click",
                function (event) {

                    // カードのリンクを止める
                    event.preventDefault();

                    // 親<a>へのクリック伝播も止める
                    event.stopPropagation();

                    // 現在の状態
                    const current =
                        getStreamStatus(
                            id,
                            type
                        );

                    // 反転
                    const newStatus =
                        !current;

                    // 保存
                    saveStreamStatus(
                        id,
                        type,
                        newStatus
                    );

                    // 表示更新
                    updateButton(
                        button,
                        type,
                        newStatus
                    );

                }
            );

        });

    });

}


// ========================================
// ボタンの表示を変更
// ========================================

function updateButton(
    button,
    type,
    checked
) {

    if (type === "watch") {

        button.textContent =
            checked ? "☑" : "□";

    }

    if (type === "favorite") {

        button.textContent =
            checked ? "★" : "☆";

    }

    if (type === "later") {

        button.textContent =
            checked ? "✅" : "🔖";

    }

    // チェック状態のクラス
    if (checked) {

        button.classList.add(
            "checked"
        );

    } else {

        button.classList.remove(
            "checked"
        );

    }

}





// ========================================
// 最新のMOVIEをTOPに表示
// ========================================

async function loadLatestMovie() {

    // TOPページのMOVIE表示場所を取得
    const latestMovie =
        document.getElementById(
            "latest-movie"
        );

    // TOPページ以外では何もしない
    if (!latestMovie) {
        return;
    }

    try {

        // MOVIEページを読み込む
        const response =
            await fetch(
                "../JUMPHTML/SakunaMovie.html"
            );

        // 読み込み失敗
        if (!response.ok) {

            throw new Error(
                "SakunaMovie.htmlを読み込めませんでした"
            );

        }

        // HTMLを文字列として取得
        const html =
            await response.text();

        // HTMLを解析
        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        // MOVIEカードを取得
        const cards =
            doc.querySelectorAll(
                ".news-card"
            );

        // MOVIEがない場合
        if (cards.length === 0) {

            latestMovie.innerHTML =
                "<p>MOVIEが見つかりませんでした。</p>";

            return;
        }

        // 「読み込み中」を削除
        latestMovie.innerHTML = "";

        // 最新3件だけ表示
        cards.forEach(
            function (card, index) {

                if (index < 3) {

                    // カードをコピー
                    const copy =
                        card.cloneNode(true);

                    // TOPではチェックボタンを表示しない
                    const actions =
                        copy.querySelector(
                            ".card-actions"
                        );

                    if (actions) {
                        actions.remove();
                    }

                    // TOPへ追加
                    latestMovie.appendChild(
                        copy
                    );

                }

            }
        );

        console.log(
            "最新のMOVIEを読み込みました！"
        );

    }
    catch (error) {

        latestMovie.innerHTML =
            "<p>MOVIEを読み込めませんでした。</p>";

        console.error(
            "MOVIEの読み込みエラー：",
            error
        );

    }

}

// ========================================
// 最新の他枠配信をTOPに表示
// ========================================

async function loadLatestOtherStream() {

    // TOPページの表示場所を取得
    const latestOtherStream =
        document.getElementById(
            "latest-other-stream"
        );

    // TOPページ以外では何もしない
    if (!latestOtherStream) {
        return;
    }

    try {

        // 他枠配信ページを読み込む
        const response =
            await fetch(
                "../JUMPHTML/SakunaOtherStream.html"
            );

        // 読み込み失敗
        if (!response.ok) {

            throw new Error(
                "SakunaOtherStream.htmlを読み込めませんでした"
            );

        }

        // HTMLを文字列として取得
        const html =
            await response.text();

        // HTMLを解析
        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        // 他枠配信カードを取得
        const cards =
            doc.querySelectorAll(
                ".news-card"
            );

        // 他枠配信がない場合
        if (cards.length === 0) {

            latestOtherStream.innerHTML =
                "<p>他枠配信が見つかりませんでした。</p>";

            return;
        }

        // 「読み込み中」を削除
        latestOtherStream.innerHTML = "";

        // 最新3件だけ表示
        cards.forEach(
            function (card, index) {

                if (index < 3) {

                    // カードをコピー
                    const copy =
                        card.cloneNode(true);

                    // TOPではチェックボタンを表示しない
                    const actions =
                        copy.querySelector(
                            ".card-actions"
                        );

                    if (actions) {
                        actions.remove();
                    }

                    // TOPへ追加
                    latestOtherStream.appendChild(
                        copy
                    );

                }

            }
        );

        console.log(
            "最新の他枠配信を読み込みました！"
        );

    }
    catch (error) {

        // エラー表示
        latestOtherStream.innerHTML =
            "<p>他枠配信を読み込めませんでした。</p>";

        console.error(
            "他枠配信の読み込みエラー：",
            error
        );

    }

}

// ========================================
// 全ページ共通の上部エリア
// ========================================

function setupCommonHeader() {

    // すでに作成されている場合は何もしない
    if (document.querySelector(".common-header")) {
        return;
    }

    // ========================================
    // 共通ヘッダー本体
    // ========================================

    const header =
        document.createElement("header");

    header.className =
        "common-header";


    // ========================================
    // 上段ナビゲーション
    // ========================================

    const navigation =
        document.createElement("nav");

    navigation.className =
        "wide-navigation";


    // 各ページへのURL
    const homeURL =
        new URL(
            "../HTML/SakunaTop.html",
            document.baseURI
        ).href;

    const newsURL =
        new URL(
            "../JUMPHTML/SakunaNews.html",
            document.baseURI
        ).href;

    const streamURL =
        new URL(
            "../JUMPHTML/SakunaStream.html",
            document.baseURI
        ).href;

    const movieURL =
        new URL(
            "../JUMPHTML/SakunaMovie.html",
            document.baseURI
        ).href;

    const otherStreamURL =
        new URL(
            "../JUMPHTML/SakunaOtherStream.html",
            document.baseURI
        ).href;


    // ナビゲーションを作成
    navigation.innerHTML = `

        <a href="${homeURL}">
            HOME
        </a>

        <a href="${newsURL}">
            NEWS
        </a>

        <a href="${streamURL}">
            STREAM
        </a>

        <a href="${movieURL}">
            MOVIE
        </a>

        <a href="${otherStreamURL}">
            他枠配信
        </a>

    `;


    header.appendChild(
        navigation
    );


    // ========================================
    // 下段の情報エリア
    // ========================================

    const headerContents =
        document.createElement("div");

    headerContents.className =
        "common-header-contents";


    // ========================================
    // 左側
    // 写真＋サイトタイトル
    // ========================================

    const headerLeft =
        document.createElement("div");

    headerLeft.className =
        "common-header-left";


    // 写真
    const image =
        document.createElement("img");

    image.src =
        new URL(
            "../JPG/さくなだふぁみりあ カラフルメモリー.jpg",
            document.baseURI
        ).href;

    image.alt =
        "結城さくな";


    // 写真をTOPページへのリンクにする
    const homeLink =
        document.createElement("a");

    homeLink.href =
        homeURL;

    homeLink.appendChild(
        image
    );

    headerLeft.appendChild(
        homeLink
    );

    headerContents.appendChild(
        headerLeft
    );



    // ========================================
    // 既存のサイトタイトル h1 を取得
    // ========================================

    const existingH1 =
        document.querySelector("h1");


    if (
        existingH1 &&
        existingH1.textContent.includes(
            "結城さくなまとめ"
        )
    ) {

        // 既存のh1を写真の横へ移動
        headerLeft.appendChild(
            existingH1
        );

    }





    // ========================================
    // 右側
    // 最近追加したもの
    // ========================================

    const recent =
        document.createElement("div");

    recent.className =
        "recent-additions";

    // ========================================
    // 最近追加したもの
    // ========================================

    const recentTitle =
        document.createElement("h2");

    recentTitle.textContent =
        "🆕 最近追加したもの";

    recent.appendChild(
        recentTitle
    );


    // 最近追加したページ
    const recentList =
        document.createElement("div");

    recentList.className =
        "recent-list";

    // 「最近追加したもの」の中に入れる
    recent.appendChild(
        recentList
    );

    // ヘッダーに追加
    headerContents.appendChild(
        recent
    );

    // ========================================
    // MOVIE
    // ========================================

    const movieLink =
        document.createElement("a");

    movieLink.href =
        new URL(
            "../JUMPHTML/SakunaMovie.html",
            document.baseURI
        ).href;

    movieLink.textContent =
        "・MOVIEを追加";

    recentList.appendChild(
        movieLink
    );


    // ========================================
    // 他枠配信
    // ========================================

    const otherStreamLink =
        document.createElement("a");

    otherStreamLink.href =
        new URL(
            "../JUMPHTML/SakunaOtherStream.html",
            document.baseURI
        ).href;

    otherStreamLink.textContent =
        "・他枠配信を追加";

    recentList.appendChild(
        otherStreamLink
    );


    // ヘッダーへ追加
    header.appendChild(
        headerContents
    );


    // ========================================
    // bodyの一番上へ追加
    // ========================================

    document.body.insertBefore(
        header,
        document.body.firstChild
    );

}

// ========================================
// 猫の足跡アニメーション
// ========================================

function startCatFootprints() {

    // 足跡を表示する場所を作成
    const footprintArea =
        document.createElement("div");

    footprintArea.className =
        "cat-footprints";

    // ページに追加
    document.body.appendChild(
        footprintArea
    );


    // 最初の位置
    let x = -50;

    let y =
        window.innerHeight * 0.7;


    // 足跡を一定時間ごとに追加
    setInterval(function () {

        // 足跡を作成
        const footprint =
            document.createElement("div");

        footprint.className =
            "cat-footprint";

        // 足跡の絵文字
        const image =
            document.createElement("img");

        image.src =
            "../JPG/猫球.png";

        image.alt =
            "猫球";

        image.style.width =
            "100%";

        image.style.height =
            "100%";

        image.style.objectFit =
            "contain";

        footprint.appendChild(
            image
        );


        // 少しずつ右へ移動
        x += 80;


        // 上下に少しランダムに動く
        y +=
            Math.random() * 80 - 40;


        // 画面の外に行かないようにする
        if (y < 100) {

            y = 100;

        }

        if (y > window.innerHeight - 100) {

            y =
                window.innerHeight - 100;

        }


        // 画面の右端まで行ったら
        if (x > window.innerWidth) {

            // 左側から再スタート
            x = -50;

            // 高さを変更
            y =
                Math.random()
                * window.innerHeight;

        }


        // 足跡の位置
        footprint.style.left =
            x + "px";

        footprint.style.top =
            y + "px";


        // ========================================
        // 足跡の向き
        // ========================================

        // 今回は左から右へ歩く
        // そのため右方向を向いているようにする
        footprint.style.transform =
            "scaleX(1) rotate(10deg)";

        // 足跡を追加
        footprintArea.appendChild(
            footprint
        );


        // アニメーション終了後に削除
        setTimeout(function () {

            footprint.remove();

        }, 2000);


    }, 700);

}


// ========================================
// 4種類のページから
// 最新の3件を自動取得して表示
// ========================================

async function loadRecentAdditions() {

    // 「最近追加したもの」を表示する場所を取得
    const recentList =
        document.querySelector(".recent-list");

    if (!recentList) {
        return;
    }


    // ========================================
    // 調べる4種類のページ
    // ========================================

    const pages = [

        {
            name: "NEWS",
            url: "../JUMPHTML/SakunaNews.html"
        },

        {
            name: "STREAM",
            url: "../JUMPHTML/SakunaStream.html"
        },

        {
            name: "MOVIE",
            url: "../JUMPHTML/SakunaMovie.html"
        },

        {
            name: "他枠配信",
            url: "../JUMPHTML/SakunaOtherStream.html"
        }

    ];


    // 取得した記事を入れる配列
    const allItems = [];


    // ========================================
    // 4ページを順番に読み込む
    // ========================================

    for (const page of pages) {

        try {

            const response =
                await fetch(page.url);


            if (!response.ok) {
                continue;
            }


            const html =
                await response.text();


            // HTMLを解析
            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            // news-cardを取得
            const cards =
                doc.querySelectorAll(
                    ".news-card"
                );


            // ========================================
            // 各カードから情報を取得
            // ========================================

            cards.forEach(function (card) {

                // カード内の日付を探す
                const text =
                    card.textContent;


                // YYYY年M月D日
                // YYYY.M.D
                // YYYY-MM-DD
                // などを取得
                const dateMatch =
                    text.match(
                        /20\d{2}[年./-]\s*\d{1,2}[月./-]\s*\d{1,2}日?/
                    );


                if (!dateMatch) {
                    return;
                }


                const dateText =
                    dateMatch[0];


                // ========================================
                // 日付をDateに変換
                // ========================================

                const normalizedDate =
                    dateText
                        .replace(/年/g, "-")
                        .replace(/月/g, "-")
                        .replace(/日/g, "")
                        .replace(/\./g, "-");


                const date =
                    new Date(
                        normalizedDate
                    );


                if (
                    isNaN(date.getTime())
                ) {
                    return;
                }


                // ========================================
                // タイトル取得
                // ========================================

                const titleElement =
                    card.querySelector("h3");


                let title =
                    titleElement
                        ? titleElement.textContent.trim()
                        : page.name;


                // ========================================
                // リンク先を取得
                // ========================================

                let link =
                    card.getAttribute("href");


                // <a>ではない場合
                if (!link) {

                    const innerLink =
                        card.querySelector("a");

                    if (innerLink) {
                        link =
                            innerLink.getAttribute("href");
                    }

                }


                // ========================================
                // 相対URLを正しいURLに変換
                // ========================================

                if (link) {

                    link =
                        new URL(
                            link,
                            new URL(
                                page.url,
                                document.baseURI
                            ).href
                        ).href;

                }


                // ========================================
                // 配列に追加
                // ========================================

                allItems.push({

                    type: page.name,

                    title: title,

                    date: date,

                    dateText: dateText,

                    link: link

                });

            });

        }
        catch (error) {

            console.error(
                page.name +
                "の読み込みエラー：",
                error
            );

        }

    }


    // ========================================
    // 日付の新しい順に並べる
    // ========================================

    allItems.sort(function (a, b) {

        return b.date - a.date;

    });


    // ========================================
    // 最新3件だけ取得
    // ========================================

    const latestItems =
        allItems.slice(0, 3);


    // 一度表示内容を空にする
    recentList.innerHTML = "";


    // ========================================
    // 最新3件を表示
    // ========================================

    latestItems.forEach(function (item) {

        // リンクを作成
        const link =
            document.createElement("a");


        // リンク先
        if (item.link) {

            link.href =
                item.link;

        }


        // 表示内容
        link.innerHTML = `

            <span class="recent-type">
                ${item.type}
            </span>

            <span class="recent-title">
                ${item.title}
            </span>

        `;


        recentList.appendChild(
            link
        );

    });


    // ========================================
    // 何も取得できなかった場合
    // ========================================

    if (latestItems.length === 0) {

        recentList.innerHTML =
            "<p>最近追加したものはありません。</p>";

    }

}

// ========================================
// STREAM 個別リンクボタン
// ========================================

function setupStreamLinkButtons() {

    const buttons =
        document.querySelectorAll(
            ".stream-link"
        );

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                // 親カードのYouTubeリンクを止める
                event.preventDefault();
                event.stopPropagation();

                // このボタンに設定したリンクを取得
                const link =
                    button.dataset.link;

                // リンクが設定されていなければ終了
                if (!link) {
                    return;
                }

                // 指定したページへ移動
                window.location.href = link;

            }
        );

    });

}

// ========================================
// SEARCHページ
// STREAM・MOVIE・他枠配信を読み込む
// ========================================

async function loadSearchItems() {

    // 検索結果を表示する場所
    const results =
        document.getElementById("search-results");

    // 検索ページではない場合は何もしない
    if (!results) {
        return;
    }

    // 読み込むページ
    const pages = [

        {
            name: "STREAM",
            url: "../JUMPHTML/SakunaStream.html"
        },

        {
            name: "MOVIE",
            url: "../JUMPHTML/SakunaMovie.html"
        },

        {
            name: "他枠配信",
            url: "../JUMPHTML/SakunaOtherStream.html"
        }

    ];

    // 全カードを入れる場所
    const allCards = [];

    // 3ページを順番に読み込む
    for (const page of pages) {

        try {

            // HTMLを読み込む
            const response =
                await fetch(page.url);

            if (!response.ok) {
                console.error(
                    page.name
                    + "を読み込めませんでした。"
                );
                continue;
            }

            // HTMLを文字列にする
            const html =
                await response.text();

            // HTMLを解析
            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );

            // news-cardを取得
            const cards =
                doc.querySelectorAll(
                    ".news-card"
                );

            console.log(
                page.name
                + "："
                + cards.length
                + "件"
            );

            // カードを保存
            cards.forEach(function (card) {

                // カードをコピー
                const copy =
                    card.cloneNode(true);

                // どのページのカードか記録
                copy.dataset.source =
                    page.name;

                // チェックボタンなどは検索ページでは消す
                const actions =
                    copy.querySelector(
                        ".card-actions"
                    );

                if (actions) {
                    actions.remove();
                }

                // 検索結果に追加
                allCards.push(copy);

            });

        }
        catch (error) {

            console.error(
                page.name
                + "読み込みエラー：",
                error
            );

        }

    }

    // ========================================
    // 日付の新しい順に並べる
    // ========================================

    allCards.sort(function (a, b) {

        // カードの日付を取得
        function getDate(card) {

            const text =
                card.textContent;

            const match =
                text.match(
                    /20\d{2}[年./-]\s*\d{1,2}[月./-]\s*\d{1,2}日?/
                );

            if (!match) {
                return new Date(0);
            }

            const dateText =
                match[0];

            const normalizedDate =
                dateText
                    .replace(/年/g, "-")
                    .replace(/月/g, "-")
                    .replace(/日/g, "")
                    .replace(/\./g, "-");

            return new Date(
                normalizedDate
            );

        }

        // 新しい日付を上にする
        return getDate(b) - getDate(a);

    });


    // ========================================
    // 検索結果を表示
    // ========================================

    results.innerHTML = "";

    allCards.forEach(function (card) {

        results.appendChild(card);

    });


    // ========================================
    // 件数表示
    // ========================================

    const count =
        document.getElementById(
            "search-result-count"
        );

    if (count) {

        count.textContent =
            "全 "
            + allCards.length
            + " 件";

    }

}

// ========================================
// SEARCHページ
// 詳細分類ボタンを作成
// ========================================

function updateDetailButtons(category) {

    const detailSection =
        document.getElementById(
            "detail-section"
        );

    const detailButtons =
        document.getElementById(
            "detail-buttons"
        );

    const results =
        document.getElementById(
            "search-results"
        );

    if (
        !detailSection ||
        !detailButtons ||
        !results
    ) {
        return;
    }


    // ========================================
    // 「すべて」の場合
    // ========================================

    if (category === "all") {

        detailButtons.innerHTML = "";

        detailSection.style.display =
            "none";

        return;
    }


    // ========================================
    // 詳細タグを集める
    // ========================================

    const details = [];

    const cards =
        results.querySelectorAll(
            ".news-card"
        );


    cards.forEach(function (card) {

        // カテゴリー
        const categories =
            card.dataset.category
                ? card.dataset.category
                    .split(",")
                    .map(function (item) {
                        return item.trim();
                    })
                : [];


        // 選択したカテゴリー以外は無視
        if (
            !categories.includes(
                category
            )
        ) {
            return;
        }


        // 詳細
        const detail =
            card.dataset.detail || "";


        if (!detail) {
            return;
        }


        // カンマ区切りに対応
        detail
            .split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(function (item) {
                return item !== "";
            })
            .forEach(function (item) {

                if (
                    !details.includes(item)
                ) {

                    details.push(item);

                }

            });

    });


    // ========================================
    // 詳細タグがない場合
    // ========================================

    if (details.length === 0) {

        detailButtons.innerHTML = "";

        detailSection.style.display =
            "none";

        return;
    }


    // ========================================
    // 詳細タグを表示
    // ========================================

    detailButtons.innerHTML = "";

    detailSection.style.display =
        "block";


    // 「すべて」
    const allButton =
        document.createElement(
            "button"
        );

    allButton.className =
        "filter-button active";

    allButton.dataset.detail =
        "all";

    allButton.textContent =
        "すべて";

    detailButtons.appendChild(
        allButton
    );


    // 詳細タグ
    details.forEach(function (detail) {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "filter-button";

        button.dataset.detail =
            detail;

        button.textContent =
            detail;

        detailButtons.appendChild(
            button
        );

    });
}

// ========================================
// SEARCHページ
// 表示件数を更新
// ========================================

function updateSearchCount() {

    // 検索結果
    const results =
        document.getElementById(
            "search-results"
        );

    // 件数表示
    const count =
        document.getElementById(
            "search-result-count"
        );

    if (!results || !count) {
        return;
    }

    // 現在表示されているカード
    const cards =
        results.querySelectorAll(
            ".news-card"
        );

    let visibleCount = 0;

    cards.forEach(function (card) {

        // 表示されているカードだけ数える
        if (
            card.style.display !== "none"
        ) {

            visibleCount++;

        }

    });

    count.textContent =
        "表示中："
        + visibleCount
        + " 件";

}


// 詳細タグのクリック処理はDOMContentLoaded内で登録します。


// ========================================
// SEARCHページ
// 詳細分類で絞り込み
// ========================================

function setupDetailFilter() {

    const detailButtons =
        document.getElementById(
            "detail-buttons"
        );

    const results =
        document.getElementById(
            "search-results"
        );

    if (!detailButtons || !results) {
        return;
    }

    // ボタンを直接ではなく
    // 詳細ボタンを入れる場所にクリック処理を設定
    detailButtons.onclick = function (event) {

        const button =
            event.target.closest(
                ".filter-button"
            );

        // 詳細ボタン以外なら何もしない
        if (!button) {
            return;
        }

        // activeを全部外す
        detailButtons
            .querySelectorAll(
                ".filter-button"
            )
            .forEach(function (item) {

                item.classList.remove(
                    "active"
                );

            });

        // 押したボタンをactive
        button.classList.add("active");

        // 選択した詳細
        const detail =
            button.dataset.detail;

        // 現在選択されている大分類
        const activeCategoryButton =
            document.querySelector(
                "#category-buttons .filter-button.active"
            );

        const category =
            activeCategoryButton
                ? activeCategoryButton.dataset.category
                : "all";

        // カードを取得
        const cards =
            results.querySelectorAll(
                ".news-card"
            );

        cards.forEach(function (card) {

            // カードのカテゴリー
            const cardCategories =
                card.dataset.category
                    ? card.dataset.category
                        .split(",")
                        .map(function (item) {
                            return item.trim();
                        })
                    : [];

            // カードの詳細
            const cardDetails =
                card.dataset.detail
                    ? card.dataset.detail
                        .split(",")
                        .map(function (item) {
                            return item.trim();
                        })
                    : [];

            // -------------------------
            // 詳細「すべて」
            // -------------------------

            if (detail === "all") {

                if (category === "all") {
                    card.style.display = "";
                    return;
                }

                if (
                    cardCategories.includes(
                        category
                    )
                ) {
                    card.style.display = "";
                }
                else {
                    card.style.display = "none";
                }

                return;
            }

            // -------------------------
            // 大分類も確認
            // -------------------------

            if (
                category !== "all" &&
                !cardCategories.includes(
                    category
                )
            ) {
                card.style.display = "none";
                return;
            }

            // -------------------------
            // 詳細分類を確認
            // -------------------------

            if (
                cardDetails.includes(
                    detail
                )
            ) {
                card.style.display = "";
            }
            else {
                card.style.display = "none";
            }

        });

        // 件数を更新
        updateSearchCount();

    };

}

// ========================================
// 再生リスト
// カテゴリーを選んだときだけ表示
// ========================================

async function setupPlaylist() {

    // 再生リストの表示場所
    const result =
        document.getElementById(
            "playlist-result"
        );

    // 再生リストページではない場合
    // 何もしない
    if (!result) {
        return;
    }


    // ========================================
    // 読み込むページ
    // ========================================

    const sources = [
        "../JUMPHTML/SakunaStream.html",
        "../JUMPHTML/SakunaOtherStream.html",
        "../JUMPHTML/SakunaMovie.html"
    ];


    // ========================================
    // 各ページのカードを取得
    // ========================================

    let allCards = [];


    for (const url of sources) {

        try {

            const response =
                await fetch(url);

            // ページを取得できなかった場合
            if (!response.ok) {

                console.error(
                    "ページを取得できませんでした:",
                    url,
                    response.status
                );

                continue;
            }

            const html =
                await response.text();

            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const cards =
                doc.querySelectorAll(
                    ".news-card"
                );

            console.log(
                "再生リスト取得:",
                url,
                "カード数:",
                cards.length
            );


            cards.forEach(function (card) {

                // 元ページがどこなのか記録
                if (url.includes("SakunaStream.html")) {

                    card.dataset.playlistSource = "stream";

                } else if (url.includes("SakunaOtherStream.html")) {

                    card.dataset.playlistSource = "otherStream";

                } else if (url.includes("SakunaMovie.html")) {

                    card.dataset.playlistSource = "movie";

                }

                allCards.push(card);

            });

        } catch (error) {

            console.error(
                "再生リストの読み込みに失敗しました:",
                url,
                error
            );

        }

    }


    // ========================================
    // 日付を取得する関数
    // ========================================

    function getCardDate(card) {

        // カードの中から日付らしい文字を探す
        const text =
            card.textContent.trim();


        // 2026年9月24日
        // 2026年09月24日
        let match =
            text.match(
                /20\d{2}年\s*\d{1,2}月\s*\d{1,2}日/
            );


        if (match) {

            const date =
                match[0]
                    .replace("年", "-")
                    .replace("月", "-")
                    .replace("日", "");

            return new Date(date);

        }


        // 2026-09-24
        match =
            text.match(
                /20\d{2}-\d{1,2}-\d{1,2}/
            );


        if (match) {

            return new Date(
                match[0]
            );

        }


        // 2026.09.24
        match =
            text.match(
                /20\d{2}\.\d{1,2}\.\d{1,2}/
            );


        if (match) {

            return new Date(
                match[0].replace(
                    /\./g,
                    "-"
                )
            );

        }


        // 2026/09/24
        match =
            text.match(
                /20\d{2}\/\d{1,2}\/\d{1,2}/
            );


        if (match) {

            return new Date(
                match[0]
            );

        }


        // 日付が見つからなかった場合
        return new Date(0);

    }


    // ========================================
    // ボタンを設定
    // ========================================

    const buttons =
        document.querySelectorAll(
            ".playlist-button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const category =
                    button.dataset
                        .playlistCategory;


                const detail =
                    button.dataset
                        .playlistDetail;


                const type =
                    button.dataset
                        .playlistType;


                showPlaylist(
                    category,
                    detail,
                    type
                );

            }
        );

    });


    // ========================================
    // 再生リストを表示
    // ========================================

    function showPlaylist(category, detail, type) {

        const result =
            document.getElementById("playlist-result");

        if (!result) {
            return;
        }

        console.log(
            "showPlaylist実行:",
            category,
            detail,
            type
        );

        // ========================================
        // タイトル
        // ========================================

        let title = category;

        if (detail) {
            title += " - " + detail;
        }

        // ========================================
        // 「戻る」ボタン
        // ========================================

        result.innerHTML = "";

        const backButton =
            document.createElement("button");

        backButton.className =
            "playlist-back-button";

        backButton.textContent =
            "← プレイリストに戻る";

        backButton.onclick =
            function () {

                // 結果を隠す
                result.style.display =
                    "none";


                // 配信・動画カテゴリーを再表示
                const playlistCategories =
                    document.querySelectorAll(
                        ".playlist-category"
                    );

                playlistCategories.forEach(
                    function (section) {

                        section.style.display =
                            "";

                    }
                );


                // タイトルを再表示
                const playlistTitle =
                    document.querySelector(
                        ".playlist-page > h2"
                    );

                if (playlistTitle) {

                    playlistTitle.style.display =
                        "";

                }

            };

        result.appendChild(backButton);


        // ========================================
        // ゲームの場合
        // ゲーム名ごとに分ける
        // ========================================

        if (category === "ゲーム" && !detail) {

            // ゲームごとにカードを入れる場所
            const gameGroups = {};

            console.log(
                "ゲーム判定開始:",
                allCards.length
            );

            // ====================================
            // ゲーム名を判定する関数
            // ====================================

            function getGameName(card) {

                // ----------------------------
                // data-detail を確認
                // ----------------------------

                const detailData =
                    card.dataset.detail || "";

                const details =
                    detailData
                        .split(",")
                        .map(function (item) {
                            return item.trim();
                        })
                        .filter(Boolean);


                // ----------------------------
                // data-category を確認
                // ----------------------------

                const categoryData =
                    card.dataset.category || "";

                const categories =
                    categoryData
                        .split(",")
                        .map(function (item) {
                            return item.trim();
                        })
                        .filter(Boolean);


                // ----------------------------
                // 「ゲーム」カテゴリーがある場合
                // ----------------------------

                if (categories.includes("ゲーム")) {

                    if (details.length > 0) {
                        return details;
                    }

                    return ["その他"];
                }


                // ====================================
                // data-category がない場合
                // タイトルからゲームを判定
                // ====================================

                const titleElement =
                    card.querySelector("h3");

                const titleText =
                    titleElement
                        ? titleElement.textContent.trim()
                        : "";


                // ----------------------------
                // ゲーム名とタイトルの対応
                // ----------------------------

                const gameKeywords = [

                    {
                        name: "Minecraft",
                        keywords: [
                            "Minecraft",
                            "minecraft",
                            "マイクラ"
                        ]
                    },

                    {
                        name: "桃鉄",
                        keywords: [
                            "桃鉄",
                            "桃太郎電鉄"
                        ]
                    },

                    {
                        name: "原神",
                        keywords: [
                            "原神"
                        ]
                    },

                    {
                        name: "トルネコ",
                        keywords: [
                            "トルネコ"
                        ]
                    },

                    {
                        name: "Echoes of Aincrad",
                        keywords: [
                            "Echoes of Aincrad"
                        ]
                    },

                    {
                        name: "リズム天国",
                        keywords: [
                            "リズム天国"
                        ]
                    }

                ];


                // ----------------------------
                // タイトルからゲームを探す
                // ----------------------------

                for (
                    let i = 0;
                    i < gameKeywords.length;
                    i++
                ) {

                    const game =
                        gameKeywords[i];

                    for (
                        let j = 0;
                        j < game.keywords.length;
                        j++
                    ) {

                        if (
                            titleText.includes(
                                game.keywords[j]
                            )
                        ) {

                            return [game.name];

                        }
                    }
                }


                // ----------------------------
                // ゲームと判断できない
                // ----------------------------

                return [];
            }


            // ====================================
            // 全カードを確認
            // ====================================

            allCards.forEach(
                function (card) {

                    const source =
                        card.dataset.playlistSource || "";

                    const isStream =
                        source === "stream";

                    const isOtherStream =
                        source === "otherStream";

                    // 配信ページ以外は除外
                    if (
                        !isStream &&
                        !isOtherStream
                    ) {
                        return;
                    }

                    // ====================================
                    // ゲーム名を取得
                    // ====================================

                    const gameNames =
                        getGameName(card);


                    // ゲームではないカード
                    // ----------------------------

                    if (gameNames.length === 0) {
                        return;
                    }


                    // ====================================
                    // ゲームごとに分類
                    // ====================================

                    gameNames.forEach(
                        function (gameName) {

                            if (
                                !gameGroups[gameName]
                            ) {

                                gameGroups[gameName] =
                                    [];

                            }

                            gameGroups[gameName]
                                .push(card);

                        }
                    );

                }
            );


            // ====================================
            // ゲームごとの表示
            // ====================================

            const gameNames =
                Object.keys(gameGroups);

            console.log(
                "ゲームグループ:",
                gameGroups
            );

            console.log(
                "ゲーム名:",
                Object.keys(gameGroups)
            );


            gameNames.forEach(
                function (gameName) {

                    const group =
                        document.createElement(
                            "section"
                        );

                    group.className =
                        "playlist-result-group";


                    // ----------------------------
                    // ゲーム名
                    // ----------------------------

                    const heading =
                        document.createElement(
                            "h3"
                        );

                    heading.textContent =
                        "🎮 " + gameName;

                    group.appendChild(
                        heading
                    );


                    // ----------------------------
                    // カードを横並び
                    // ----------------------------

                    const cards =
                        document.createElement(
                            "div"
                        );

                    cards.className =
                        "playlist-result-cards";


                    // ----------------------------
                    // 日付の新しい順
                    // ----------------------------

                    gameGroups[gameName].sort(
                        function (a, b) {

                            return (
                                getCardDate(b) -
                                getCardDate(a)
                            );

                        }
                    );


                    // ----------------------------
                    // カードを表示
                    // ----------------------------

                    gameGroups[gameName].forEach(
                        function (card) {

                            const clone =
                                card.cloneNode(true);


                            // チェックボタンを削除
                            const actions =
                                clone.querySelector(
                                    ".card-actions"
                                );

                            if (actions) {
                                actions.remove();
                            }


                            cards.appendChild(
                                clone
                            );

                        }
                    );


                    group.appendChild(
                        cards
                    );

                    result.appendChild(
                        group
                    );

                }
            );


            // ====================================
            // ゲームが一つもない場合
            // ====================================

            if (gameNames.length === 0) {

                const message =
                    document.createElement(
                        "p"
                    );

                message.textContent =
                    "該当するゲーム配信がありません。";

                result.appendChild(
                    message
                );
            }


        } else {

            // ========================================
            // ゲーム以外
            // カテゴリーごとに表示
            // ========================================

            const filteredCards =
                allCards.filter(
                    function (card) {

                        const source =
                            card.dataset.playlistSource || "";


                        // ----------------------------
                        // 配信・動画の種類を確認
                        // ----------------------------

                        const isMovie =
                            source === "movie";

                        const isStream =
                            source === "stream";

                        const isOtherStream =
                            source === "otherStream";


                        // ----------------------------
                        // コラボ・PR
                        // 配信＋動画の両方を対象
                        // ----------------------------

                        if (
                            category === "コラボ" ||
                            category === "PR"
                        ) {

                            const categoryData =
                                card.dataset.category || "";

                            const categories =
                                categoryData
                                    .split(",")
                                    .map(
                                        function (item) {
                                            return item.trim();
                                        }
                                    )
                                    .filter(Boolean);


                            const detailData =
                                card.dataset.detail || "";

                            const details =
                                detailData
                                    .split(",")
                                    .map(
                                        function (item) {
                                            return item.trim();
                                        }
                                    )
                                    .filter(Boolean);


                            return (
                                categories.includes(
                                    category
                                ) ||
                                details.includes(
                                    category
                                )
                            );
                        }


                        // ----------------------------
                        // 配信・動画の種類を確認
                        // ----------------------------

                        if (
                            type === "movie" &&
                            !isMovie
                        ) {
                            return false;
                        }


                        if (
                            type === "stream" &&
                            !isStream &&
                            !isOtherStream
                        ) {
                            return false;
                        }


                        // ----------------------------
                        // category
                        // ----------------------------

                        const categoryData =
                            card.dataset.category || "";

                        const categories =
                            categoryData
                                .split(",")
                                .map(
                                    function (item) {
                                        return item.trim();
                                    }
                                )
                                .filter(Boolean);


                        // カテゴリーが一致しない
                        if (
                            !categories.includes(
                                category
                            )
                        ) {
                            return false;
                        }


                        // ----------------------------
                        // detail
                        // ----------------------------

                        if (detail) {

                            const detailData =
                                card.dataset.detail || "";

                            const details =
                                detailData
                                    .split(",")
                                    .map(
                                        function (item) {
                                            return item.trim();
                                        }
                                    )
                                    .filter(Boolean);


                            if (
                                !details.includes(
                                    detail
                                )
                            ) {
                                return false;
                            }
                        }


                        // 条件をすべて通過
                        return true;

                    }
                );


            // ====================================
            // 通常カテゴリーの表示
            // ====================================

            const cards =
                document.createElement(
                    "div"
                );

            cards.className =
                "playlist-result-cards";


            // 日付の新しい順
            filteredCards.sort(
                function (a, b) {

                    return (
                        getCardDate(b) -
                        getCardDate(a)
                    );

                }
            );


            // カードを表示
            filteredCards.forEach(
                function (card) {

                    const clone =
                        card.cloneNode(true);


                    // チェックボタンを削除
                    const actions =
                        clone.querySelector(
                            ".card-actions"
                        );

                    if (actions) {
                        actions.remove();
                    }


                    cards.appendChild(
                        clone
                    );

                }
            );


            result.appendChild(
                cards
            );

        }


        // ========================================
        // プレイリスト入口を隠す
        // ========================================

        // 「配信」「動画」のカテゴリーを隠す
        const playlistCategories =
            document.querySelectorAll(
                ".playlist-category"
            );

        playlistCategories.forEach(
            function (section) {

                section.style.display =
                    "none";

            }
        );

        // 「再生リスト - PLAYLIST -」の見出しを隠す
        const playlistTitle =
            document.querySelector(
                ".playlist-page > h2"
            );

        if (playlistTitle) {

            playlistTitle.style.display =
                "none";

        }


        // ========================================
        // 結果を表示
        // ========================================

        result.style.display =
            "block";


        // ========================================
        // 結果を表示
        // ========================================

        result.style.display =
            "block";

    }

    // ========================================
    // 最初は結果エリアを隠す
    // ========================================

    result.style.display =
        "none";



    // ========================================
    // 各カテゴリーの最新画像を表示
    // ========================================

    // ========================================
    // 各カテゴリーの最新画像を表示
    // ========================================

    const thumbnailAreas =
        document.querySelectorAll(
            ".playlist-thumbnail"
        );


    thumbnailAreas.forEach(
        function (area) {

            const category =
                area.dataset
                    .thumbnailCategory;

            const detail =
                area.dataset
                    .thumbnailDetail;

            const type =
                area.dataset
                    .thumbnailType;


            // ========================================
            // 条件に合うカードだけ探す
            // ========================================

            let matchedCards =
                allCards.filter(
                    function (card) {

                        const source =
                            card.dataset
                                .playlistSource || "";


                        // 現在のplaylistSourceに合わせる
                        const isMovie =
                            source === "movie";

                        const isStream =
                            source === "stream" ||
                            source === "otherStream";


                        // ========================================
                        // 配信・動画を確認
                        // ========================================

                        // コラボ・PRは
                        // 配信＋動画の両方から探す
                        if (
                            category === "コラボ" ||
                            category === "PR"
                        ) {

                            // 特に種類を指定しない
                            // → 配信・動画どちらも対象

                        }
                        else {

                            if (
                                type === "movie" &&
                                !isMovie
                            ) {
                                return false;
                            }


                            if (
                                type === "stream" &&
                                !isStream
                            ) {
                                return false;
                            }

                        }


                        // ========================================
                        // categoryを取得
                        // ========================================

                        const categoryData =
                            card.dataset.category || "";

                        const categories =
                            categoryData
                                .split(",")
                                .map(
                                    function (item) {
                                        return item.trim();
                                    }
                                )
                                .filter(Boolean);


                        // ========================================
                        // detailを取得
                        // ========================================

                        const detailData =
                            card.dataset.detail || "";

                        const details =
                            detailData
                                .split(",")
                                .map(
                                    function (item) {
                                        return item.trim();
                                    }
                                )
                                .filter(Boolean);


                        // ========================================
                        // コラボ・PR
                        // ========================================

                        if (
                            category === "コラボ" ||
                            category === "PR"
                        ) {

                            if (
                                !categories.includes(category) &&
                                !details.includes(category)
                            ) {
                                return false;
                            }

                        }
                        else {

                            // ====================================
                            // 通常カテゴリー
                            // ====================================

                            if (
                                !categories.includes(category)
                            ) {
                                return false;
                            }

                        }


                        // ========================================
                        // detail
                        // ========================================

                        if (detail) {

                            if (
                                !details.includes(detail)
                            ) {
                                return false;
                            }

                        }


                        return true;

                    }
                );


            // ========================================
            // 新しい順に並べる
            // ========================================

            matchedCards.sort(
                function (a, b) {

                    return (
                        getCardDate(b) -
                        getCardDate(a)
                    );

                }
            );


            // ========================================
            // 最新の1件だけ使用
            // ========================================

            if (
                matchedCards.length === 0
            ) {
                return;
            }


            const latestCard =
                matchedCards[0];


            // ========================================
            // 最新カードの画像
            // ========================================

            const originalImage =
                latestCard.querySelector(
                    "img"
                );


            if (!originalImage) {
                return;
            }


            // ========================================
            // 画像を作成
            // ========================================

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                originalImage.src;

            image.alt =
                category +
                " 最新";


            // ========================================
            // 最新カードへのリンク
            // ========================================

            const originalLink =
                latestCard.querySelector(
                    "a"
                );


            if (originalLink) {

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    originalLink.href;

                link.target =
                    originalLink.target ||
                    "_self";


                link.appendChild(
                    image
                );

                area.appendChild(
                    link
                );

            }
            else {

                area.appendChild(
                    image
                );

            }

        }
    );
}

// ========================================
// SEARCHページ
// 大分類で絞り込み
// ========================================

function setupSearchFilter() {

    // 大分類ボタンを取得
    const categoryButtons =
        document.querySelectorAll(
            "#category-buttons .filter-button"
        );

    // 検索結果を取得
    const results =
        document.getElementById(
            "search-results"
        );

    // 検索結果がないページでは何もしない
    if (!results) {
        return;
    }

    // 最初は詳細タグを非表示
    updateDetailButtons("all");

    // 大分類ボタンを1個ずつ設定
    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                // すべてのボタンからactiveを外す
                categoryButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );

                // 押したボタンをactive
                button.classList.add(
                    "active"
                );

                // 選択したカテゴリー
                const category =
                    button.dataset.category;

                // 検索結果のカード
                const cards =
                    results.querySelectorAll(
                        ".news-card"
                    );

                // カードを絞り込む
                cards.forEach(
                    function (card) {

                        // 「すべて」の場合
                        if (
                            category === "all"
                        ) {

                            card.style.display =
                                "";

                            return;
                        }

                        // カードのカテゴリーを取得
                        const cardCategories =
                            card.dataset.category
                                ? card.dataset.category
                                    .split(",")
                                    .map(
                                        function (item) {
                                            return item.trim();
                                        }
                                    )
                                : [];

                        // カテゴリーが含まれているか
                        if (
                            cardCategories.includes(
                                category
                            )
                        ) {

                            card.style.display =
                                "";

                        }
                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );

                // 件数を更新
                updateSearchCount();

                // 詳細タグを更新
                updateDetailButtons(
                    category
                );

            }
        );

    });

}

// ========================================
// 共通オープニング・ページ上部へ戻るボタン
// ========================================

/* 全ページ共通オープニング。初回アクセスとページ更新時に再生し、ページ移動時は再生しません。 */
(() => {
  const start = () => {
    // 更新（Ctrl+R / F5 / 更新ボタン）は毎回再生する。
    // 通常のページ間移動は同じタブで初回再生済みならスキップする。
    const key = 'sakuna-opening-played';
    const nav = performance.getEntriesByType('navigation')[0];
    const isReload = nav?.type === 'reload' ||
      (!nav && performance.navigation?.type === 1);
    try {
      if (!isReload && sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    } catch (e) {
      // ストレージが使えない環境では通常どおり再生
    }
    if (document.getElementById('sakuna-opening')) return;
    const opening = document.createElement('div');
    opening.id = 'sakuna-opening';
    opening.className = 'sakuna-opening';
    opening.setAttribute('aria-label', 'サイトのオープニング演出');
    opening.innerHTML = `
      <div class="sakuna-opening__glow"></div>
      <div class="sakuna-opening__ornaments" aria-hidden="true">
        <span>✦</span><span>♡</span><span>✧</span><span>♡</span><span>✦</span><span>✧</span><span>♡</span><span>✦</span>
      </div>
      <div class="sakuna-opening__center">
        <div class="sakuna-opening__crown" aria-hidden="true">✧ ♡ ✧</div>
        <p class="sakuna-opening__eyebrow">Step By Step You</p>
        <p class="sakuna-opening__title">結城さくな</p>
        <p class="sakuna-opening__subtitle">始まった夢が私の場所になる<br>Hello Hello</p>
        <div class="sakuna-opening__progress" aria-hidden="true"><span></span></div>
      </div>`;
    document.body.prepend(opening);
    document.body.classList.add('is-intro-playing');
    const finish = () => {
      opening.classList.add('is-finished');
      document.body.classList.remove('is-intro-playing');
      window.setTimeout(() => opening.remove(), 1000);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else window.setTimeout(finish, 2900);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();


/* 全ページ共通：ページ末尾の「上に戻る」ボタン */
(() => {
  const install = () => {
    if (document.querySelector('.sakuna-page-top')) return;
    const footer = document.createElement('div');
    footer.className = 'sakuna-page-top';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sakuna-page-top__button';
    button.setAttribute('aria-label', 'ページの先頭に戻る');
    button.innerHTML = '<span class="sakuna-page-top__arrow" aria-hidden="true">↑</span><span>ページ上部へ</span>';
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    footer.appendChild(button);
    document.body.appendChild(footer);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once: true});
  else install();
})();


/* ========================================
   全ページ共通：スクロール中は操作ボタンを非表示
   スクロール停止350ms後に再表示
   ======================================== */
(() => {
  const installScrollButtonVisibility = () => {
    if (document.getElementById('sakuna-scroll-buttons-style')) return;

    const style = document.createElement('style');
    style.id = 'sakuna-scroll-buttons-style';
    style.textContent = `
      .menu-btn, .search-button, .back-button, .sakuna-page-top,
      .sakuna-page-top__button {
        transition: opacity 0.25s ease, visibility 0.25s ease !important;
      }
      body.sakuna-is-scrolling .menu-btn,
      body.sakuna-is-scrolling .search-button,
      body.sakuna-is-scrolling .back-button,
      body.sakuna-is-scrolling .sakuna-page-top,
      body.sakuna-is-scrolling .sakuna-page-top__button {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .menu-btn, .search-button, .back-button, .sakuna-page-top,
        .sakuna-page-top__button { transition: none !important; }
      }
    `;
    document.head.appendChild(style);

    let stopTimer;
    window.addEventListener('scroll', () => {
      document.body.classList.add('sakuna-is-scrolling');
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        document.body.classList.remove('sakuna-is-scrolling');
      }, 350);
    }, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installScrollButtonVisibility, { once: true });
  } else {
    installScrollButtonVisibility();
  }
})();

(function applySearchScreenshotStyle() {
    if (document.getElementById('sakuna-search-screenshot-style')) return;
    const style = document.createElement('style');
    style.id = 'sakuna-search-screenshot-style';
    style.textContent = '/* SEARCHページ：参考画像のピンク×水色デザイン */\nbody.search-page .search-area {width:calc(100% - 48px);max-width:1410px;margin:28px auto 32px;}\nbody.search-page .filter-section {background:rgba(255,255,255,.82);border:1px solid rgba(255,255,255,.9);padding:26px 24px 24px;margin-bottom:22px;border-radius:20px;box-shadow:0 10px 28px rgba(123,107,137,.11);}\nbody.search-page .filter-section h3 {font-size:19px;letter-spacing:.05em;color:#936181;margin:0 0 18px;font-weight:800;}\nbody.search-page .filter-buttons {display:flex;flex-wrap:wrap;align-items:center;gap:11px 12px;}\nbody.search-page .filter-button,body.search-page .filter-button:hover,body.search-page .filter-button:focus-visible {font-size:16px;line-height:1.4;font-weight:700;padding:13px 21px;min-height:50px;white-space:normal;border:1px solid #d2d2d2;border-radius:28px;background:#fff;color:#343434;box-shadow:none;transform:none;text-shadow:none;}\nbody.search-page .filter-button:hover {border-color:#c7a9c5;background:#fff8fc;}\nbody.search-page .filter-button.active,body.search-page .filter-button.active:hover {background:linear-gradient(105deg,#ffd5e6,#e5f5ff)!important;color:#7d5275!important;border-color:transparent!important;box-shadow:0 0 0 2px #fff,0 0 0 5px #8cd4f8!important;}\nbody.search-page #detail-buttons .filter-button.active,body.search-page #detail-buttons .filter-button.active:hover {box-shadow:0 0 0 2px #fff,0 0 0 5px #8cd4f8!important;}\nbody.search-page .filter-button::before,body.search-page .filter-button::after {display:none!important;}\nbody.search-page #detail-section {display:none;}\nbody.search-page #search-result-count {color:#555;font-size:17px;}\n@media(max-width:650px){body.search-page .search-area{width:calc(100% - 24px);margin:18px auto;}body.search-page .filter-section{padding:18px 14px;border-radius:16px;}body.search-page .filter-buttons{gap:8px;}body.search-page .filter-button,body.search-page .filter-button:hover,body.search-page .filter-button:focus-visible{font-size:13px;min-height:40px;padding:9px 13px;}}\n';
    document.head.appendChild(style);
})();


// ========================================
// SEARCHページ：入力型リアルタイム検索
// ジャンル・詳細と組み合わせて1文字から部分一致
// ========================================
function setupTextSearch() {
    const results = document.getElementById('search-results');
    const categories = document.getElementById('category-buttons');
    const details = document.getElementById('detail-buttons');
    if (!results || !categories) return;
    if (document.getElementById('sakuna-text-search')) return;

    const style = document.createElement('style');
    style.textContent = `
      .search-page .sakuna-text-search-panel {
        margin: 20px 0 24px; padding: 24px;
        border-radius: 20px;
        background: rgba(255,255,255,.88);
        box-shadow: 0 10px 28px rgba(134,150,179,.12);
      }
      .search-page .sakuna-text-search-title {
        display:block; margin-bottom: 14px; font-weight: 800;
        color: #996381; font-size: 18px;
      }
      .search-page .sakuna-text-search-field {
        display:flex; align-items:center; gap:12px;
        border: 1px solid #d6d9e0; border-radius: 999px;
        background: #fff; padding: 6px 12px 6px 20px;
        transition: box-shadow .2s, border-color .2s;
      }
      .search-page .sakuna-text-search-field:focus-within {
        border-color:#8dcff4; box-shadow:0 0 0 3px rgba(141,207,244,.3);
      }
      .search-page #sakuna-text-search {
        width:100%; min-width:0; border:0!important; outline:0!important;
        background:transparent!important; box-shadow:none!important;
        font:inherit; font-size:16px; padding:10px 0; color:#39343d;
      }
      .search-page .sakuna-text-search-clear {
        border:0; border-radius:999px; background:linear-gradient(110deg,#ffe0ec,#e1f2ff);
        color:#785d77; padding:9px 16px; font-weight:700; cursor:pointer;
        white-space:nowrap;
      }
      .search-page .sakuna-text-search-note {
        margin:10px 0 0; color:#73717a; font-size:13px;
      }
      .search-page .sakuna-search-empty {
        padding:24px; text-align:center; color:#86667b;
        background:rgba(255,255,255,.82); border-radius:16px;
      }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('section');
    panel.className = 'sakuna-text-search-panel';
    const label = document.createElement('label');
    label.className = 'sakuna-text-search-title';
    label.htmlFor = 'sakuna-text-search';
    label.textContent = 'キーワード検索';
    const field = document.createElement('div');
    field.className = 'sakuna-text-search-field';
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'sakuna-text-search';
    input.placeholder = '配信者名・ゲーム名などを入力…';
    input.autocomplete = 'off';
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'sakuna-text-search-clear';
    clear.textContent = 'クリア';
    field.append(input, clear);
    const note = document.createElement('p');
    note.className = 'sakuna-text-search-note';
    note.textContent = '1文字から検索できます。ジャンル・詳細との組み合わせも可能です。';
    panel.append(label, field, note);

    const resultHeading = results.closest('section') || results;
    if (resultHeading.parentNode) {
        resultHeading.parentNode.insertBefore(panel, resultHeading);
    } else {
        results.before(panel);
    }

    const empty = document.createElement('p');
    empty.className = 'sakuna-search-empty';
    empty.textContent = '該当する記事がありません。';
    empty.hidden = true;
    results.after(empty);

    const normalize = value => String(value || '')
        .normalize('NFKC').toLocaleLowerCase('ja-JP')
        .replace(/\s+/g, ' ').trim();
    const splitTags = value => String(value || '').split(',').map(normalize);

    function applySearch() {
        const category = categories.querySelector('.filter-button.active')?.dataset.category || 'all';
        const detail = details?.querySelector('.filter-button.active')?.dataset.detail || 'all';
        const query = normalize(input.value);
        let count = 0;
        const cards = results.querySelectorAll('.news-card');
        cards.forEach(card => {
            const categoryMatch = category === 'all' || splitTags(card.dataset.category).includes(normalize(category));
            const detailMatch = detail === 'all' || splitTags(card.dataset.detail).includes(normalize(detail));
            // 本文・タイトル・カテゴリ・詳細を対象に部分一致検索
            const searchable = normalize([
                card.textContent, card.dataset.category, card.dataset.detail
            ].join(' '));
            const matches = categoryMatch && detailMatch && (!query || searchable.includes(query));
            card.style.display = matches ? '' : 'none';
            if (matches) count++;
        });
        const countElement = document.getElementById('search-result-count');
        if (countElement) countElement.textContent = '表示中：' + count + ' 件';
        empty.hidden = count !== 0 || cards.length === 0;
        if (cards.length === 0) {
            empty.hidden = false;
            empty.textContent = '記事を読み込めませんでした。Live Serverなどでページを開いてください。';
        } else {
            empty.textContent = '該当する記事がありません。';
        }
    }
    input.addEventListener('input', applySearch);
    clear.addEventListener('click', () => { input.value = ''; applySearch(); input.focus(); });
    // 既存のジャンル・詳細クリック処理の後に、入力条件も含めて再判定
    categories.addEventListener('click', event => {
        if (event.target.closest('.filter-button')) applySearch();
    });
    if (details) details.addEventListener('click', event => {
        if (event.target.closest('.filter-button')) applySearch();
    });
    applySearch();
}



// ===== SAKUNA LUXE: スクロール登場・検索欄・検索件数 =====
(() => {
  function installSakunaLuxe() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const results = document.getElementById('search-results');
    // 既存の入力検索欄にアイコンを追加。検索ロジックは変更しない。
    const searchField = document.querySelector('.search-page .sakuna-text-search-field');
    if (searchField && !searchField.querySelector('.sakuna-search-magnifier')) {
      const icon = document.createElement('span');
      icon.className = 'sakuna-search-magnifier';
      icon.textContent = '⌕';
      icon.setAttribute('aria-hidden', 'true');
      searchField.prepend(icon);
    }
    // 件数の変化を検知して控えめにアニメーション
    const count = document.getElementById('search-result-count');
    if (count && !reduceMotion) {
      let lastText = count.textContent;
      const observer = new MutationObserver(() => {
        const nextText = count.textContent;
        if (nextText === lastText) return;
        lastText = nextText;
        count.classList.remove('sakuna-count-updated');
        void count.offsetWidth;
        count.classList.add('sakuna-count-updated');
      });
      observer.observe(count, {childList:true,characterData:true,subtree:true});
    }
    // 見出しに控えめな猫モチーフ（重複追加しない）
    document.querySelectorAll('main h2, main h3, .search-page section > h2').forEach(heading => {
      if (!heading.closest('.news-card') && !heading.classList.contains('sakuna-paw-heading')) {
        heading.classList.add('sakuna-paw-heading');
      }
    });
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sakuna-revealed');
        io.unobserve(entry.target);
      });
    }, {threshold:.08,rootMargin:'0px 0px 35px 0px'});
    const watch = node => {
      if (!(node instanceof Element) || node.matches('.sakuna-reveal-ready')) return;
      node.classList.add('sakuna-reveal-ready');
      io.observe(node);
    };
    // 既存の検索結果は動的に読み込まれるため、後から追加されたカードも監視
    document.querySelectorAll('.news-card, main h2, main h3, .search-page section > h2').forEach(watch);
    if (results) {
      const mo = new MutationObserver(records => {
        for (const record of records) for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches('.news-card')) watch(node);
          node.querySelectorAll?.('.news-card').forEach(watch);
        }
      });
      mo.observe(results,{childList:true,subtree:true});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installSakunaLuxe, {once:true});
  else installSakunaLuxe();
})();


/* ==========================================================
   SAKUNA CAT DECORATIONS — 追加用コード
   1. カードからひょっこり猫 / 2. マウス肉球
   3. フッターの眠る猫 / 4. 猫のしっぽ
========================================================== */
(() => {
  'use strict';
  if (window.__sakunaCatDecorationsLoaded) return;
  window.__sakunaCatDecorationsLoaded = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const css = `
    .sakuna-peek-cat { position:absolute; right:12px; top:0; width:58px; height:47px;
      transform:translateY(-39%) rotate(5deg); transform-origin:50% 100%;
      pointer-events:none; z-index:4; transition:transform .38s cubic-bezier(.2,.8,.2,1); }
    .sakuna-peek-cat svg {width:100%;height:100%;overflow:visible;filter:drop-shadow(0 3px 4px rgba(167,113,143,.16));}
    .sakuna-peek-cat .sakuna-eye {transform-box:fill-box;transform-origin:center;animation:sakuna-cat-blink 6s infinite;}
    .sakuna-cat-card:hover .sakuna-peek-cat,
    .sakuna-cat-card:focus-within .sakuna-peek-cat {transform:translateY(-72%) rotate(-3deg);}
    .sakuna-cat-card {overflow:visible !important;}
    @keyframes sakuna-cat-blink {0%,43%,46%,100%{transform:scaleY(1)}44%,45%{transform:scaleY(.08)}}
    .sakuna-mouse-paw {position:fixed;z-index:99999;pointer-events:none;width:19px;height:19px;
      transform:translate(-50%,0) rotate(var(--paw-rotate,0deg));
      animation:sakuna-paw-fade .8s ease-out forwards;}
    .sakuna-mouse-paw svg {display:block;width:100%;height:100%;}
    @keyframes sakuna-paw-fade {0%{opacity:.68;scale:.7}45%{opacity:.55;scale:1}100%{opacity:0;scale:1.2}}
    .sakuna-sleep-cat {display:flex;align-items:flex-end;justify-content:flex-end;
      margin:24px clamp(16px,6vw,90px) 12px auto;width:124px;max-width:35vw;
      position:relative;z-index:2;}
    .sakuna-sleep-cat svg {display:block;width:100%;height:auto;
      transform-origin:50% 80%;animation:sakuna-cat-breathe 3.5s ease-in-out infinite;
      filter:drop-shadow(0 5px 9px rgba(172,123,151,.16));}
    .sakuna-sleep-cat .sakuna-sleep-open {opacity:0;transition:opacity .2s;}
    .sakuna-sleep-cat:hover .sakuna-sleep-open {opacity:1;}
    .sakuna-sleep-cat:hover .sakuna-sleep-closed {opacity:0;}
    @keyframes sakuna-cat-breathe {0%,100%{transform:scale(1)}50%{transform:scale(1.035,.975)}}
    .sakuna-tail-btn {position:relative !important;overflow:visible !important;isolation:isolate;}
    .sakuna-tail {position:absolute;left:-13px;right:auto;bottom:6px;width:22px;height:33px;
      pointer-events:none;z-index:-1;transform-origin:70% 90%;transform:rotate(-10deg);
      transition:transform .3s;}
    .sakuna-tail svg {width:100%;height:100%;overflow:visible;transform:scaleX(-1);}
    .sakuna-tail-btn:hover .sakuna-tail,.sakuna-tail-btn:focus-visible .sakuna-tail {
      animation:sakuna-tail-wag .8s ease-in-out infinite alternate;}
    @keyframes sakuna-tail-wag {from{transform:rotate(14deg)}to{transform:rotate(-22deg)}}
    @media (max-width:600px){.sakuna-peek-cat{width:44px;height:36px;right:8px}.sakuna-sleep-cat{width:90px}}
    @media (prefers-reduced-motion:reduce){
      .sakuna-peek-cat,.sakuna-sleep-cat svg,.sakuna-peek-cat .sakuna-eye,.sakuna-tail {animation:none !important;transition:none !important;}
      .sakuna-mouse-paw{display:none !important;}
    }
  `;
  const style = document.createElement('style');
  style.id = 'sakuna-cat-decorations-style';
  style.textContent = css;
  document.head.appendChild(style);

  const peekCat = `<span class="sakuna-peek-cat" aria-hidden="true"><svg viewBox="0 0 64 54" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 27 7 5 23 17 Q32 12 41 17 L57 5 56 28 Q63 44 48 49 Q32 56 16 49 Q1 43 8 27Z" fill="#fffafc" stroke="#d9a0bd" stroke-width="2.3" stroke-linejoin="round"/>
    <path d="M12 12 13 24 23 19Z M52 12 51 24 41 19Z" fill="#f8c9dd"/>
    <g class="sakuna-eye" fill="#8d6582"><ellipse cx="23" cy="33" rx="2.5" ry="3.5"/><ellipse cx="41" cy="33" rx="2.5" ry="3.5"/></g>
    <path d="M29 40 Q32 43 35 40 L32 38Z" fill="#e79cbd"/><path d="M32 42q-4 5-7 0m7 0q4 5 7 0" stroke="#a77b94" fill="none" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M17 40 7 38 M17 44 8 45 M47 40 57 38 M47 44 56 45" stroke="#cda4b9" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="16" cy="39" r="4" fill="#ffc7db" opacity=".65"/><circle cx="48" cy="39" r="4" fill="#ffc7db" opacity=".65"/>
  </svg></span>`;

  const sleepCat = `<div class="sakuna-sleep-cat" aria-hidden="true" title="おやすみにゃ…"><svg viewBox="0 0 150 112" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="75" cy="102" rx="60" ry="7" fill="#dceeff" opacity=".8"/>
    <path d="M28 83 Q11 50 45 45 Q76 27 110 52 Q139 72 112 94 Q88 107 49 99 Q28 98 28 83Z" fill="#fff9fc" stroke="#d9a4bd" stroke-width="2.4"/>
    <path d="M40 61 37 27 60 43 Q77 35 93 43 L115 27 112 63 Q117 85 95 93 Q75 101 54 92 Q33 83 40 61Z" fill="#fff" stroke="#d9a4bd" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M42 35 45 53 57 45Z M109 35 106 53 95 45Z" fill="#f6c6d9"/>
    <g class="sakuna-sleep-closed" stroke="#946e87" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M56 69q8 8 16 0 M81 69q8 8 16 0"/></g>
    <g class="sakuna-sleep-open" fill="#946e87"><ellipse cx="64" cy="70" rx="3.2" ry="4.2"/><ellipse cx="89" cy="70" rx="3.2" ry="4.2"/></g>
    <path d="M73 78 77 81 81 78Z" fill="#e9a0be"/><path d="M77 81q-3 4-6 0m6 0q3 4 6 0" stroke="#946e87" stroke-width="1.4" fill="none"/>
    <ellipse cx="51" cy="78" rx="7" ry="4" fill="#ffd4e4"/><ellipse cx="102" cy="78" rx="7" ry="4" fill="#ffd4e4"/>
    <path d="M110 89q30 4 24-20q-3-8-11-5" stroke="#d9a4bd" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M110 89q30 4 24-20q-3-8-11-5" stroke="#fff9fc" stroke-width="6" fill="none" stroke-linecap="round"/>
  </svg></div>`;

  const tail = `<span class="sakuna-tail" aria-hidden="true"><svg viewBox="0 0 26 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 37Q17 25 10 15Q4 4 19 3" stroke="#d59fbd" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M4 37Q17 25 10 15Q4 4 19 3" stroke="#fff0f7" stroke-width="5" fill="none" stroke-linecap="round"/></svg></span>`;

  function decorate(root) {
    const cardSelector = '#latest-news .news-card, #latest-stream .news-card, #latest-movie .news-card, #latest-other-stream .news-card, .news-list .news-card, .cards > .news-card';
    const cards = root.querySelectorAll ? root.querySelectorAll(cardSelector) : [];
    cards.forEach(card => {
      if (card.dataset.sakunaPeekAdded) return;
      card.dataset.sakunaPeekAdded = 'true';
      card.classList.add('sakuna-cat-card');
      // 既存のクリックやカード内部の構造には触れず、装飾だけ追加する。
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
      card.insertAdjacentHTML('beforeend', peekCat);
    });
    const buttons = root.querySelectorAll ? root.querySelectorAll('.btn, .profile-btn, .filter-button') : [];
    buttons.forEach(button => {
      if (button.dataset.sakunaTailAdded) return;
      button.dataset.sakunaTailAdded = 'true';
      button.classList.add('sakuna-tail-btn');
      button.insertAdjacentHTML('beforeend', tail);
    });
  }

  function init() {
    decorate(document);
    if (!document.querySelector('.sakuna-sleep-cat')) {
      document.body.insertAdjacentHTML('beforeend', sleepCat);
    }
    // 動的に読み込まれたニュース・配信カードも装飾。
    const observer = new MutationObserver(records => {
      if (!records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && !node.classList?.contains('sakuna-peek-cat') && !node.classList?.contains('sakuna-tail')))) return;
      decorate(document);
    });
    observer.observe(document.body, {childList:true, subtree:true});

    // 足跡はPCのマウス移動時だけ。多量生成しないよう間引く。
    if (!reduceMotion.matches && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      let last = 0, count = 0;
      document.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        const now = performance.now();
        if (now - last < 100) return;
        last = now;
        const paw = document.createElement('span');
        paw.className = 'sakuna-mouse-paw';
        paw.style.left = event.clientX + 'px';
        paw.style.top = (event.clientY + 10) + 'px';
        paw.style.setProperty('--paw-rotate', ((count++ % 2) ? 17 : -17) + 'deg');
        const color = count % 2 ? '#f2b6d2' : '#b9dff5';
        paw.innerHTML = `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" fill="${color}"><ellipse cx="14" cy="19" rx="8" ry="6"/><ellipse cx="5" cy="12" rx="3" ry="4"/><ellipse cx="11" cy="6" rx="3" ry="4"/><ellipse cx="19" cy="6" rx="3" ry="4"/><ellipse cx="25" cy="12" rx="3" ry="4"/></svg>`;
        // body の zoom の影響を受けないよう html 直下に配置する。
        // clientX/clientY と position:fixed を同じ画面座標系に揃える。
        document.documentElement.appendChild(paw);
        paw.addEventListener('animationend', () => paw.remove(), {once:true});
        setTimeout(() => paw.remove(), 1100);
      }, {passive:true});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();


/* PLAYLISTページ：猫耳・しっぽ＋6種類のランダムな表情 */
(function () {
  const isPlaylist = () => !!document.querySelector('.playlist-category');
  // 他のHTMLと共通の6表情（目・口・頬・ひげの形も同じ）
  const ink = '#a96f93';
  const eyes = [
    '<ellipse cx="21" cy="17" rx="3" ry="4"/><ellipse cx="43" cy="17" rx="3" ry="4"/>',
    '<path d="M16 18q5 -7 10 0M38 18q5 -7 10 0" fill="none" stroke-width="2.6"/>',
    '<path d="M17 17h8M39 17h8" fill="none" stroke-width="2.5" stroke-linecap="round"/>',
    '<ellipse cx="21" cy="17" rx="3" ry="4"/><path d="M38 18q5 -7 10 0" fill="none" stroke-width="2.6"/>',
    '<circle cx="21" cy="17" r="4"/><circle cx="43" cy="17" r="4"/><circle cx="22" cy="15" r="1.2" fill="white"/><circle cx="44" cy="15" r="1.2" fill="white"/>',
    '<path d="M16 18q5 5 10 0M38 18q5 5 10 0" fill="none" stroke-width="2.5"/>'
  ];
  const mouths = [
    '<path d="M32 31v3m0 0q-5 6-9 0m9 0q5 6 9 0" fill="none" stroke-width="1.8"/>',
    '<path d="M27 34q5 7 10 0" fill="none" stroke-width="2"/>',
    '<path d="M32 31v3m0 0q-5 3-8 0m8 0q5 3 8 0" fill="none" stroke-width="1.8"/>',
    '<ellipse cx="32" cy="36" rx="3.2" ry="3.8" fill="#d889a8" stroke="none"/>',
    '<path d="M26 34q6 7 12 0" fill="none" stroke-width="2.4"/>',
    '<path d="M28 35q4 3 8 0" fill="none" stroke-width="1.8"/>'
  ];
  const faces = eyes.map((eye, i) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44">` +
      `<g stroke="${ink}" fill="${ink}" stroke-linecap="round">` +
      `<path d="M12 26 2 22M12 31 2 33M52 26 62 22M52 31 62 33" fill="none" stroke-width="2.2"/>` +
      eye + `<path d="M28 27Q32 24 36 27L32 31Z" fill="#ec8daf" stroke="none"/>` +
      mouths[i] + `</g>` +
      `<ellipse cx="13" cy="25" rx="6" ry="3" fill="#f8aec9" opacity=".55"/>` +
      `<ellipse cx="51" cy="25" rx="6" ry="3" fill="#f8aec9" opacity=".55"/>` +
      `</svg>`;
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  });
  const tail = '<span class="sakuna-tail" aria-hidden="true"><svg viewBox="0 0 26 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 37Q17 25 10 15Q4 4 19 3" stroke="#d59fbd" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M4 37Q17 25 10 15Q4 4 19 3" stroke="#fff0f7" stroke-width="5" fill="none" stroke-linecap="round"/></svg></span>';
  function decorate() {
    if (!isPlaylist()) return;
    document.querySelectorAll('.playlist-button, .playlist-back-button').forEach(button => {
      if (button.dataset.sakunaPlaylistFace === 'true') return;
      button.dataset.sakunaPlaylistFace = 'true';
      if (!button.dataset.sakunaCatFaceSet) {
        button.style.setProperty('--sakuna-cat-face', faces[Math.floor(Math.random() * faces.length)]);
        button.dataset.sakunaCatFaceSet = 'true';
      }
      button.classList.add('sakuna-tail-btn');
      if (!button.querySelector('.sakuna-tail')) button.insertAdjacentHTML('beforeend', tail);
    });
  }
  function init() {
    if (!isPlaylist()) return;
    decorate();
    new MutationObserver(decorate).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();