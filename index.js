const ffmpeg = require('ffmpeg');

const FILE_IN = process.env.FILE_IN;
const RESIZE_PERC = process.env.RESIZE_PERC;
const FILE_OUT = process.env.FILE_OUT;

async function main() {
    try {
        const video = await new ffmpeg(FILE_IN);
        video.setVideoSize(RESIZE_PERC);
        await video.save(FILE_OUT);
    } catch (e) {
        console.log('Error: ', e);
    }
}

main().catch(e => console.error(e));
