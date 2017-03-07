var exec = require('child_process').exec;

module.exports = function (command)
{
    return new Promise(function (resolve, reject)
    {
        exec(command, function (error, stdout, stderr)
        {
            if (error) return reject(error);
            if (stderr) console.log('stderr: ' + stderr);
            if (stdout) console.log(stdout);
            return resolve();
        });
    });
}
