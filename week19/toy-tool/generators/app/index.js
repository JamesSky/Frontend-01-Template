var Generator = require('yeoman-generator');

module.exports = class extends Generator {
   // The name `constructor` is important here
   constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  collecting(){
    this.log('collecting is my name')
  }
  creating() {
     this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: 'tt-template' }
    );
    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('lib/createElement.js')
    );
    this.fs.copyTpl(
      this.templatePath('TabPanel.js'),
      this.destinationPath('lib/TabPanel.js')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('rc/.babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copyTpl(
      this.templatePath('rc/.nycrc'),
      this.destinationPath('.nycrc')
    );
    this.fs.copyTpl(
      this.templatePath('test/main.test.js'),
      this.destinationPath('test/main.test.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: 'my toy-template'}
    );
    this.yarnInstall(
      [
        "@babel/core",
        "@babel/plugin-transform-react-jsx",
        "@babel/preset-env",
        "babel-loader",
        "babel-cli",
        'html-webpack-plugin',
        "css-loader",
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@istanbuljs/nyc-config-babel",
        "mocha",
        "@babel/register",
        "babel-plugin-istanbul",
        "nyc",
        "css"
      ],
      {'save-dev':true}
    )
    // this.fs.copyTpl(
    //   this.templatePath('index.html'),
    //   this.destinationPath('public/index.html'),
    //   { title: 'Templating with Yeoman' }
    // );
  }
};