/**
 * Created by beiwan on 2017/12/29.
 */
const util = require('util')
const getPixels = require("get-pixels");
const fs = require('fs');
const path = require('path');
const cv = require('opencv4nodejs');
const exec = util.promisify(require('child_process').exec)

const ADB_PATH = 'adb'
const SCREENCAP_REMOTE_PATH = '/sdcard/screencap.png'
const SCREENCAP_PATH = path.resolve('.', 'public/images/jump_screencap')
const green = new cv.Vec(0, 255, 0);

const BOOM = 4.88

jumpGo = async (timeout) => {
    const r = Math.random() * 20
    const {stdout} = await exec(`${ADB_PATH} shell input touchscreen swipe ${150 + r} ${200 + r} ${140 + r} ${100 + r} ${timeout}`)
    console.log(stdout)
}

fetchScreenCap = async () => {
    const {stdout, stderr} = await exec(`${ADB_PATH} exec-out screencap -p > ${SCREENCAP_PATH}/screencap.png`)
    console.log('fetch...')
}

pullScreenCap = async () => {
    const {stdout, stderr} = await exec(`${ADB_PATH} pull ${SCREENCAP_REMOTE_PATH} ${SCREENCAP_PATH}/screencap.png`, [])
    console.log('pull...')
}

distance = (start, end) => {
    return Math.sqrt(Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2));
}

getStartPoint = () => {
    const orginImg = cv.imread(`${SCREENCAP_PATH}/screencap.png`, 0)
    const template = cv.imread('start.png', 0)

    const res = orginImg.matchTemplate(template, cv.TM_CCOEFF_NORMED)
    const {minVal, maxVal, minLoc, maxLoc} = res.minMaxLoc()


    const resultStart = orginImg.copy();
    resultStart.drawRectangle(
        new cv.Point(maxLoc.x, maxLoc.y),
        new cv.Point(maxLoc.x + template.cols, maxLoc.y + template.rows),
        green,
        {thickness: 2}
    );

    const gaussianBlurImg = orginImg.gaussianBlur(new cv.Size(5, 5), 0)
    const resultEndCanny = gaussianBlurImg.canny(1, 10)


    const resultEnd = resultEndCanny.copy();

    cv.imwrite(`${SCREENCAP_PATH}/resultStart.png`, resultStart);
    cv.imwrite(`${SCREENCAP_PATH}/resultEnd.png`, resultEnd);
}


getStartPoint()
iJump = async (distance) => {
    await jumpGo(parseInt(distance * BOOM))

    await setTimeout(async () => {
        await fetchScreenCap()
        getStartPoint()
    }, 2000)
}

refreshScreencap = async () => {
    await fetchScreenCap()
    getStartPoint()
}

module.exports = {
    iJump,
    refreshScreencap
}
