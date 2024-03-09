const express = require('express')
const router = express.Router()

const fs = require('fs');
const ytdl = require('ytdl-core');

express().use(express.urlencoded({extended:true}))

function extractVideoId(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
}

router.post('/Download', (req, res) => {
  const YTurl = req.body.YTurl;
  const videoId = extractVideoId(YTurl);
  if (!videoId) {
    return res.status(400).send('Invalid YouTube URL');
  }

  const filePath = __dirname + '\\outputs\\'+videoId + '.mp4';

  const videoStream = ytdl(YTurl, { filter: 'audioandvideo' });
  const writeStream = fs.createWriteStream(filePath);

  writeStream.on('finish', () => {
    res.sendFile(filePath, {
      headers: {
        'Content-Disposition': `attachment; filename=${filePath}`,
        'Content-Type': 'video/mp4',
      }
    }, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error sending file');
      } else {
        
        fs.unlinkSync(filePath);
      }
    });
  });

  videoStream.pipe(writeStream);
});

router.get('/',(req,res)=>{
    res.render('index')
})


module.exports = router