var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'about', 'clear', 'contact', 'date', 'echo', 'exit', 'help', 'links', '<span class="inactive">login</span>', '<span class="inactive">register</span>'
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; 
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'date':
          output( '<div class="item">< </div>' + new Date() );
          break;
        case 'echo':
          output( '<div class="item">< </div> ' + args.join(' ') );
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'about':
          output('<div class="item">< </div>Santiago Gómez<br><div class="item">< </div>23y<br><div class="item">< </div>Mar del Plata, Argentina');
          break;
        case 'contact':
          output('<div class="item">< </div>+54 223 4379870<br><div class="item">< </div>sag.gomez@gmail.com');
          break;
        case 'links':
          output('<div class="item">< </div><a href="https://sant1g.com" target="_blank">sant1g.com</a><br><div class="item">< </div><a href="https://twitter.com/sant1g target="_blank"">twitter.com/sant1g</a><br><div class="item">< </div><a href="https://github.com/sant1g" target="_blank">github.com/sant1g</a>');
          break;
        case 'exit':
          $('#container').toggle();
          break;
        case 'login':
          output('<div class="item">< </div>ERROR: User Management System not working yet.');
          break;
        case 'register':
          output('<div class="item">< </div>ERROR: User Management System not working yet.');
          break;
        default:
          if (cmd) {
            output('<div class="item">< </div>ERROR: command \'' + cmd + '\' not found. Type \'help\' to display available commands.');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }
  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }
  return {
    init: function() {
      output('<h2 style="letter-spacing: 4px; margin-top:-15px !important; color: #2162a5;">sant1g-cli</h2><p></p><p>Enter \'help\' for available commands.</p>');
    },
    output: output
  }
};

$(function() {
  
  $('.prompt').html('~ >');

  // Initialize a new terminal object
  var term = new Terminal('#input-line .cmdline', '#container output');
  term.init();
});