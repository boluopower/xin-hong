# Xin Hong Data


Put your "新红网红数据N" folder under this repo like this:

    /xin-hong
        /新红网红数据1
            1美妆.xlsx
            2美容个护.xlsx
            3鞋包潮玩.xlsx
            4穿搭打扮.xlsx
            5美食.xlsx
            6母婴育儿.xlsx
            ...
        /新红网红数据2
            10生活.xlsx
            11运动健身.xlsx
            12兴趣爱好.xlsx
            13影视综.xlsx
            14婚嫁.xlsx
            15摄影摄像.xlsx
            16萌宠.xlsx
            ...
        README.md
        .gitignore
        main.js
        package.json


Fill the `.env_1`:

    COOKIE=xxx
    INPUT_DIR=新红网红数据1


Then install necessary packages from Terminal:

    npm install

Then run main.js from Terminal:

    ENV_FILE=.env_1 node main.js

