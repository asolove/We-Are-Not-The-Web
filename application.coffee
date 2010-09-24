
checkGroups = [[], [], [], []]
checkBlinks = [
  {0:true, 1:false,2:true, 3:false},
  {1:true, 3:false},
  {2:true, 3:false},
  {3:true, 0:false}]
  
initBlink = () ->
  for i,blinks of checkBlinks
    for beat,checked of blinks
      $(document).observe "beat:"+beat, () ->
        for checkBox in checkGroups[i]
          checkBox.checked = checked

initCheckBoxes = () ->
  corners = [["top","left"],["top","right"],["bottom","left"],["bottom","right"]]
  transitions = [
    {top:"easeInOutBack",bottom:"easeInOutBack",left:"easeOutBack",right:"easeOutBack"},
    {top:"spring", bottom: "spring", left: "swingFromTo", right:"swingFromTo"}
  ]
  indices = {} 
  reuse = {}
  checkboxCount = 0
  for [v,h] in corners
    indices[v+h] = 0
    reuse[v+h] = []
    
  createOrReuseCheckBox = (corner, i) ->
    reuse[corner].shift() || createCheckBox(corner, i) 
  createCheckBox = (corner, i) -> 
    $(v+h).insert "<input id='"+v+h+i+"' type='checkbox'/>"
    checkbox = $ v+h+i
    checkGroups[i%4].push checkbox
    checkbox
    
  
  document.observe "beat:1", () -> 
    for [v,h] in corners
      for t in transitions
        corner = v+h
        i = indices[corner]
        checkBox = createOrReuseCheckBox(corner, i)
        .setStyle("#{v}:50%;#{h}:50%;position:absolute;")
        .morph "#{v}:13%;#{h}:10%;",
          duration: 10,
          propertyTransitions: t
          after: () -> reuse[corner].push(checkBox);
        indices[corner] = indices[corner]+1
  

initRadioButtons = () ->
  count = 12
  
  for i, r of {1: 100, 2:180}
    $("wrap").insert "<div id='radioCircle#{i}'></div>"
    circle = $("radioCircle#{i}").setStyle("margin:-#{r}px -#{r}px;top:50%;left:50%;width:#{2*r}px;height:#{2*r}px;position:absolute;")
    for j in [0..count-1] 
      theta = 2*3.14 / count * j
      top = r - r * Math.sin(theta)
      left = r + r * Math.cos(theta)
      circle.insert "<input type='radio' id='radio#{i}#{j}' name='circle#{i}' style='left:#{left}px;top:#{top}px;position:absolute'/>"
    
  selected = 0
  document.observe "beat:1", () ->
    $('radio2'+selected).checked = true
    $('radio1'+2*selected%count).checked = true
    selected = (selected+1)%count
  document.observe "beat:3", () ->
    $('radio1'+(2*selected-1)%count).checked = true

jiggleCircle = () ->
  

b = 0
m = 0
mouseX = 0
mouseY = 0
document.observe "mousemove", (event) ->
  mouseX = Event.pointerX(event)
  mouseY = Event.pointerY(event)
  
document.observe "beat:1", () -> bgColor(100)
document.observe "beat:3", () -> bgColor(200)

bgColor = (b) ->
  r = Math.floor(mouseX / $(document.width) * 255)
  g = Math.floor(mouseY / $(document.height) * 255)
  color = "rgb(#{r},#{g},#{b})"
  $(document.body).setStyle "background-color:#{color}"
  
bIndex = 0
animate2 = () ->
  $("b").insert "<select id='b"+bIndex+"'/><option>We</option><option>are</option><option>not</option><option>the</option><option>web</option><option>yet</option>"
  select = $("b"+bIndex)
  .setStyle 
    left: "48%"
    bottom: "45%"
    position: "absolute"
  .morph "left:55%;bottom:0%;",
    duration: 10,
    propertyTransitions:
      bottom: "easeInCirc"
      left: "mirror"
      after: () -> select.remove()
  bIndex++;
  
document.observe "beat:1", () ->
  $$("select")
    .each (select) -> select.size = 0

document.observe "beat:3", () ->
  $$("select")
    .each (select) -> select.size = page


pages = 7
document.observe "dom:loaded", () ->
  $("essay").hide()
  for page in [1..pages]
    $("page"+page).hide()
    
page = 1 
click = 1
show = true
document.observe "click", (event) ->
  $("wrap").toggle()
  $("essay").toggle()  
  if show
    $("page"+page).show()
    $("page"+page).scrollTo()
    page++
  else if page is 8
    $("essay").show().setStyle("opacity:0.4")
    for p in [1..pages]
      morphs = ["margin-left:200px;margin-bottom:20px","margin-left:-200px;margin-bottom:20px"]
      $("page"+p).morph(morphs[p%2], {duration: 5, delay:p, transition:"mirror"})
  show = !show
  


beat = 0
oneBeat = () ->
  document.fire "beat:"+beat
  document.fire "beat:all", {beat: beat}
  beat = (beat + 1) % 4


animate = () ->
  animate2()
  
init = () ->
  beatLength = 60/155*1000 # tempo of the song
  setInterval(animate, beatLength*4)
  setInterval(oneBeat, beatLength/2)
  initBlink()
  initCheckBoxes()
  initRadioButtons()
      
document.observe "dom:loaded", () -> init()