
$('button.correct').click(function () {
    $('.centertable').css("display","none");
    $('.div').css("display","block");
    $('input[name="sender"]').val(this.name);
    $('.formname').text("Welcome "+this.name+" 👏");
});
