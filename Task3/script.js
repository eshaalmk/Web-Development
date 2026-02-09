$(function () {

  let size = 200;
  let timer = 0;
  let last = Date.now();

  $(document).mousemove(function (e) {
    $("#sprinkler").css({
      left: e.clientX,
      top: e.clientY
    });
  });

  function overFire() {
    let s = $("#sprinkler")[0].getBoundingClientRect();
    let f = $("#fire")[0].getBoundingClientRect();

    return s.left < f.right && s.right > f.left &&
           s.top < f.bottom && s.bottom > f.top;
  }

  function waterDrop() {
    $("<div class='drop'>")
      .css({
        left: $("#sprinkler").offset().left,
        top: $("#sprinkler").offset().top
      })
      .appendTo("body")
      .animate({ top: "+=100", opacity: 0 }, 400, function () {
        $(this).remove();
      });
  }

  function loop() {
    let now = Date.now();
    let dt = now - last;
    last = now;

    if (overFire() && size > 0) {
      timer += dt;

      if (Math.random() < 0.3) waterDrop();

      if (timer >= 3000) {
        size -= 30;
        $("#fire").css("width", size);
        timer = 0;
      }
    } else {
      timer = 0;
    }

    requestAnimationFrame(loop);
  }

  loop();
});
