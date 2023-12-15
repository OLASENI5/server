import fs from "fs";
import path from "path";

const fileRemover = (filter) => {
    fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
        if(err && err.code == "ENOENT") {
            //File doesn't exist
            console.log(`file ${filename} doesn't exist, won't remove it.`)
        } else if(err) {
            console.log(`Error occured while trying to remove file ${filename}`);
        } else {
            console.log(`remove ${filename}`);
        }
    });
};

export default fileRemover;