(function() {
  var animate, animate2, b, bIndex, beat, checkBlinks, checkGroups, click, init, initBlink, initCheckBoxes, initRadioButtons, jiggleCircle, m, oneBeat, page, pages, show;
  var __hasProp = Object.prototype.hasOwnProperty;
  checkGroups = [[], [], [], []];
  checkBlinks = [
    {
      0: true,
      1: false,
      2: true,
      3: false
    }, {
      1: true,
      3: false
    }, {
      2: true,
      3: false
    }, {
      3: true,
      0: false
    }
  ];
  initBlink = function() {
    var _a, _b, _c, i;
    _a = []; _c = checkBlinks;
    for (_b in _c) {
      if (!__hasProp.call(_c, _b)) continue;
      (function() {
        var _d, _e, _f, beat;
        var i = _b;
        var blinks = _c[_b];
        return _a.push((function() {
          _d = []; _f = blinks;
          for (_e in _f) {
            if (!__hasProp.call(_f, _e)) continue;
            (function() {
              var beat = _e;
              var checked = _f[_e];
              return _d.push($(document).observe("beat:" + beat, function() {
                var _g, _h, _i, _j, checkBox;
                _g = []; _i = checkGroups[i];
                for (_h = 0, _j = _i.length; _h < _j; _h++) {
                  checkBox = _i[_h];
                  _g.push(checkBox.checked = checked);
                }
                return _g;
              }));
            })();
          }
          return _d;
        })());
      })();
    }
    return _a;
  };
  initCheckBoxes = function() {
    var _a, _b, _c, _d, checkboxCount, corners, createCheckBox, createOrReuseCheckBox, h, indices, reuse, transitions, v;
    corners = [["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]];
    transitions = [
      {
        top: "easeInOutBack",
        bottom: "easeInOutBack",
        left: "easeOutBack",
        right: "easeOutBack"
      }, {
        top: "spring",
        bottom: "spring",
        left: "swingFromTo",
        right: "swingFromTo"
      }
    ];
    indices = {};
    reuse = {};
    checkboxCount = 0;
    _b = corners;
    for (_a = 0, _d = _b.length; _a < _d; _a++) {
      _c = _b[_a];
      v = _c[0];
      h = _c[1];
      indices[v + h] = 0;
      reuse[v + h] = [];
    }
    createOrReuseCheckBox = function(corner, i) {
      return reuse[corner].shift() || createCheckBox(corner, i);
    };
    createCheckBox = function(corner, i) {
      var checkbox;
      $(v + h).insert("<input id='" + v + h + i + "' type='checkbox'/>");
      checkbox = $(v + h + i);
      checkGroups[i % 4].push(checkbox);
      return checkbox;
    };
    return document.observe("beat:1", function() {
      var _e, _f, _g, _h, _i;
      _e = []; _g = corners;
      for (_f = 0, _i = _g.length; _f < _i; _f++) {
        (function() {
          var _j, _k, _l, _m;
          var         _h = _g[_f];
        v = _h[0];
        h = _h[1];
;
          return _e.push((function() {
            _j = []; _l = transitions;
            for (_k = 0, _m = _l.length; _k < _m; _k++) {
              (function() {
                var checkBox, corner, i;
                var t = _l[_k];
                return _j.push((function() {
                  corner = v + h;
                  i = indices[corner];
                  checkBox = createOrReuseCheckBox(corner, i).setStyle("" + (v) + ":50%;" + (h) + ":50%;position:absolute;").morph("" + (v) + ":13%;" + (h) + ":10%;", {
                    duration: 10,
                    propertyTransitions: t,
                    after: function() {
                      return reuse[corner].push(checkBox);
                    }
                  });
                  return (indices[corner] = indices[corner] + 1);
                })());
              })();
            }
            return _j;
          })());
        })();
      }
      return _e;
    });
  };
  initRadioButtons = function() {
    var _a, circle, count, i, j, left, r, selected, theta, top;
    count = 12;
    _a = {
      1: 100,
      2: 180
    };
    for (i in _a) {
      if (!__hasProp.call(_a, i)) continue;
      r = _a[i];
      $("wrap").insert("<div id='radioCircle" + (i) + "'></div>");
      circle = $("radioCircle" + (i)).setStyle("margin:-" + (r) + "px -" + (r) + "px;top:50%;left:50%;width:" + (2 * r) + "px;height:" + (2 * r) + "px;position:absolute;");
      for (j = 0; (0 <= count - 1 ? j <= count - 1 : j >= count - 1); (0 <= count - 1 ? j += 1 : j -= 1)) {
        theta = 2 * 3.14 / count * j;
        top = r - r * Math.sin(theta);
        left = r + r * Math.cos(theta);
        circle.insert("<input type='radio' id='radio" + (i) + (j) + "' name='circle" + (i) + "' style='left:" + (left) + "px;top:" + (top) + "px;position:absolute'/>");
      }
    }
    selected = 0;
    document.observe("beat:1", function() {
      $('radio2' + selected).checked = true;
      $('radio1' + 2 * selected % count).checked = true;
      return (selected = (selected + 1) % count);
    });
    return document.observe("beat:3", function() {
      return ($('radio1' + (2 * selected - 1) % count).checked = true);
    });
  };
  jiggleCircle = function() {};
  b = 0;
  m = 0;
  document.observe("mousemove", function(event) {
    var color, g, r;
    if (m++ === 3) {
      m = 0;
      r = Math.floor(Event.pointerX(event) / $(document.width) * 255);
      g = Math.floor(Event.pointerY(event) / $(document.height) * 255);
      b = (b + 10) % 255;
      color = ("rgb(" + (r) + "," + (g) + "," + (b) + ")");
      return $(document.body).setStyle("background-color:" + (color));
    }
  });
  bIndex = 0;
  animate2 = function() {
    var select;
    $("b").insert("<select id='b" + bIndex + "'/><option>We</option><option>are</option><option>not</option><option>the</option><option>web</option><option>yet</option>");
    select = $("b" + bIndex).setStyle({
      left: "48%",
      bottom: "45%",
      position: "absolute"
    }).morph("left:55%;bottom:0%;", {
      duration: 10,
      propertyTransitions: {
        bottom: "easeInCirc",
        left: "mirror",
        after: function() {
          return select.remove();
        }
      }
    });
    return bIndex++;
  };
  document.observe("beat:1", function() {
    return $$("select").each(function(select) {
      return (select.size = 0);
    });
  });
  document.observe("beat:3", function() {
    return $$("select").each(function(select) {
      return (select.size = page);
    });
  });
  pages = 7;
  document.observe("dom:loaded", function() {
    var _a, page;
    $("essay").hide();
    _a = [];
    for (page = 1; (1 <= pages ? page <= pages : page >= pages); (1 <= pages ? page += 1 : page -= 1)) {
      _a.push($("page" + page).hide());
    }
    return _a;
  });
  page = 1;
  click = 1;
  show = true;
  document.observe("click", function(event) {
    var morphs, p;
    $("wrap").toggle();
    $("essay").toggle();
    if (show) {
      $("page" + page).show();
      $("page" + page).scrollTo();
      page++;
    } else if (page === 8) {
      $("essay").show().setStyle("opacity:0.4");
      for (p = 1; (1 <= pages ? p <= pages : p >= pages); (1 <= pages ? p += 1 : p -= 1)) {
        morphs = ["margin-left:200px;margin-bottom:20px", "margin-left:-200px;margin-bottom:20px"];
        $("page" + p).morph(morphs[p % 2], {
          duration: 5,
          delay: p,
          transition: "mirror"
        });
      }
    }
    return (show = !show);
  });
  beat = 0;
  oneBeat = function() {
    document.fire("beat:" + beat);
    document.fire("beat:all", {
      beat: beat
    });
    return (beat = (beat + 1) % 4);
  };
  animate = function() {
    return animate2();
  };
  init = function() {
    var beatLength;
    beatLength = 60 / 155 * 1000;
    setInterval(animate, beatLength * 4);
    setInterval(oneBeat, beatLength / 2);
    initBlink();
    initCheckBoxes();
    return initRadioButtons();
  };
  document.observe("dom:loaded", function() {
    return init();
  });
})();
