/**
 * Created by beiwan on 2017/12/29.
 */
const util = require('util')
const fs = require('fs');
const path = require('path');
const exec = util.promisify(require('child_process').exec)

const ADB_PATH = 'adb'
const SCREENCAP_REMOTE_PATH = '/sdcard/screencap.jpg'
const SCREENCAP_PATH = path.resolve('.', 'public/images/jump_screencap')

const BOOM = 4.88

jumpGo = async (timeout) => {
    const {stdout} = await exec(`${ADB_PATH} shell input touchscreen swipe 170 187 170 187 ${timeout}`)
    console.log(stdout)
}

fetchScreenCap = async () => {
    const {stdout, stderr} = await exec(`${ADB_PATH} exec-out screencap -p > ${SCREENCAP_PATH}/screencap.jpg`)
    console.log('fetch...')
}

pullScreenCap = async () => {
    const {stdout, stderr} = await exec(`${ADB_PATH} pull ${SCREENCAP_REMOTE_PATH} ${SCREENCAP_PATH}/screencap.jpg`, [])
    console.log('pull...')
}

distance = (start, end) => {
    return Math.sqrt(Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2));
}

iJump = async (distance) => {
    await jumpGo(parseInt(distance * BOOM))
    await setTimeout(async() => {
        await fetchScreenCap()
    }, 2000)
}

refreshScreencap = async() => {
    await fetchScreenCap()
}

module.exports = {
    iJump,
    refreshScreencap
}
