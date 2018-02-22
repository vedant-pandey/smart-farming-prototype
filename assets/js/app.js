$(document).ready(function() {
    $("section[data-step]").hide();
    $("button.button-outline").hide();
    $("section[data-step=1]").show();
    $("input[type='submit']").click(function(e) {
        e.preventDefault();
        var step = $("form").data("step");
        var isValid = true;
        $("section[data-step='" + step + "'] input[required='required']").each(function(idx, elem) {
            $(elem).removeClass("error");
            if($(elem).val().trim() === "") {
                isValid = false;
                $(elem).addClass("error");
            }
        });
        if(isValid) {
            step += 1;
            if(step > $("section[data-step]").length) {
                $("form").submit(); //Submit the form to the URL in the action attribute, or you could always do something else.
            }
            $("form").data("step", step);
            $("section[data-step]").hide();
            $("section[data-step='" + step + "']").show();
            $("button.button-outline").show();
        }
    });
    $("button.button-outline").click(function(e) {
        e.preventDefault();
        var step = $("form").data("step");
        step -= 1;
        $("form").data("step", step);
        $("section[data-step]").hide();
        $("section[data-step='" + step + "']").show();
        if(step === 1) {
            $("button.button-outline").hide();
        }
    });
});
