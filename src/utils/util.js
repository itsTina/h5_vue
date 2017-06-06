var errorTip = function($target, tip) {
  $target.show();
  $target.text(tip);

  setTimeout(function() {
    $target.removeClass('error-tip');
    $target.addClass('error-tip-fade');

    setTimeout(function() {
      $target.removeClass('error-tip-fade');
      $target.addClass('error-tip');

      $target.hide();
    }, 500);
  }, 2000);
}

export function errorTip($target, tip) {
  return errorTip($target, tip)
}

