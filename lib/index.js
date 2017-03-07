#! /usr/bin/env node

//Dependencies
const fs = require('fs');
const path = require('path');

//Required
const commands = require('./commands');
const commandRunner = require('./commandRunner');

main();

function main()
{
    commandRunner(commands.init).then(() =>
    {
        return writeScripts(commands.scripts);
    }).then(() =>
    {
        console.log('Wrote scripts to package.json');
        return installDependencies(commands.devDependencies, true);
    }).then(() =>
    {
        console.log('Installed devDependencies');
        return installDependencies(commands.dependencies, false);
    }).then(() =>
    {
        console.log('Installed dependencies');
        return makeFolders(commands.folders);
    }).then(() =>
    {
        console.log('Built project structure');
        return copyFiles(commands.files);
    }).then(() =>
    {
        console.log('Wrote files');
        return writeGitIgnore();
    }).then(() =>
    {
        console.log('Wrote .gitignore');
        console.log('Done.');
    }).catch((e) =>
    {
        console.log('\nError');
        console.log(e);
    });
}

//Jobs
function writeScripts(scripts)
{
    return new Promise((resolve, reject) =>
    {
        let packageJSON;
        fs.readFile('./package.json', (err, data) =>
        {
            if (err) return reject(err);
            data = JSON.parse(data);

            for (let scriptName in scripts)
            {
                data.scripts[scriptName] = scripts[scriptName];
            }

            const newFile = JSON.stringify(data, null, 4);
            fs.writeFile('./package.json', newFile, (err, data) =>
            {
                if (err) return reject(err);
                return resolve();
            });
        });
    })
}

/* Commands/helpers */

//Create the project structure
function makeFolders(folders)
{
    return folders.reduce((prev, folderName) =>
    {
        return prev.then((res) =>
        {
            return commandRunner('mkdir ' + folderName);
        });
    }, Promise.resolve());
}

//Copy required files
function copyFiles(fileNames)
{
    return fileNames.reduce((prev, fileName) =>
    {
        return copyFile(fileName);
    }, Promise.resolve());
}

function copyFile(fileName)
{
    const filePath = __dirname + '/files/' + fileName;
    const targetPath = fileName.indexOf('webpack.config.js') >= 0 ? process.cwd() : process.cwd() + '/src';
    const cmd = `cp ${filePath} ${targetPath}`;
    return commandRunner(cmd);
}

function writeGitIgnore()
{
    return new Promise((resolve, reject) =>
    {
        fs.writeFile('./.gitignore', 'node_modules/', (err, data) =>
        {
            if (err) return reject(err);
            return resolve();
        });
    });
}

//Install dev and regular dependencies
function installDependencies(dependencies, dev)
{
    const save = dev ? ' --save-dev' : ' --save';
    const moduleString = makeModuleString(dependencies);
    const command = 'npm install ' + moduleString + save;
    return commandRunner(command);
}


/* Utility */

//Format npm install commands
function makeModuleString(dependencies)
{
    let modules = [];
    for (let module in dependencies)
    {
        let version = dependencies[module];
        modules.push(module + '@' + version);
    }
    return modules.join(' ');
}
