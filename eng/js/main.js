$(document).ready(function() {
    /* scroll */
    $("a[href^='#']").not("[data-target]").click(function(){
      if ($(window).width() < 1365) {
        $("html").removeClass("menu_active");
        $(".menu").removeClass("active");
        $(".menu__mobile").slideUp();
        $(".menu__burger").removeClass("active");
      }
      var _href = $(this).attr("href");
      $("html, body").animate({scrollTop: $(_href).offset().top - 70 +"px"});
      return false;
    });

    /*menu*/
    $(".menu .menu__burger").click(function(){
      $("html").toggleClass("menu_active");
      $(".menu__mobile").slideToggle();
      $(".menu").toggleClass("active");
      $(".menu__burger").toggleClass("active");
    });

    /*tab*/
    $(".choice__item .choice_btn").click(function(){
        $(this).parent().parent().toggleClass("choice__item_active");
        $(this).parent().parent().find(".choice__item_hidden").slideToggle();
    });

    /*reviews*/
    $(".show_rev").click(function(){
      $(".reviews_img .hidden").toggleClass("hide");
      $(this).hide();
      $(".hide_rev").show();
    });
    $(".hide_rev").click(function(){
      $(".reviews_img .hidden").toggleClass("hide");
      $(this).hide();
      $("html, body").animate({scrollTop: $("#back").offset().top - 170 +"px"});
      $(".show_rev").show();
    });

    /*выбор типа урока*/
    $(".lesson_item .button_white").click(function(){
      let comm = $(this).parent().siblings(".lesson_title").text().replace(/\s+/g, " ");
      $("input[name=comment]").val(comm);
    });


    /*rev slider*/
    $('.reviews_slider').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: $(".rev_slider .slider_prev"),
      nextArrow: $(".rev_slider .slider_next")
    });

    $('.lesson_slider').slick({
      infinite: true,
      dots: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      prevArrow: $(".less_slider .slider_prev"),
      nextArrow: $(".less_slider .slider_next"),
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            dots: false,
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 784,
          settings: {
            dots: false,
            centerMode: true,
            variableWidth: true,
            slidesToScroll: 1,
          }
        }
      ]
    });

    $('.video_slider').slick({
      swipeToSlide: true,
      initialSlide: 3,
      infinite: true,
      speed: 300,
      centerMode: true,
      variableWidth: true,
      arrows: true,
      prevArrow: $(".vid_slider .slider_prev"),
      nextArrow: $(".vid_slider .slider_next")
    });

    /*tab*/
    $(".faq__item .faq__quest").click(function() {
      $(".faq__item").not($(this).parent()).removeClass("active");
      $(".faq__item").not($(this).parent()).find(".faq__answer").slideUp();
      $(this).parent().toggleClass("active");
      $(this).siblings(".faq__answer").slideToggle();
    });
    

    let countryCode = "";

    const input = document.querySelector("#phone");
    const iti = window.intlTelInput(input, {
      nationalMode: false,
      initialCountry: "auto",
      preferredCountries : ["ru", "ua", "by", "kz", "md", "uz", "tj", "am", "az", "pl", "lv", "lt", "ee"],
      geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => {
            countryCode = data.country_code; // сохраняем код страны в глобальной переменной
            callback(countryCode);
            changePrice(countryCode);
          })
          .catch(() => {
            countryCode = "ru"; // сохраняем значение по умолчанию в глобальной переменной
            callback(countryCode);
          });
      }
    });
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        if (iti.isValidNumber()) {
          input.classList.remove("invalid");
        } else {
          input.classList.add("invalid");
        }
      }
    });
    input.addEventListener("countrychange", function() {
      var selectedCountryData = iti.getSelectedCountryData();
      changePrice(selectedCountryData.iso2);
    });

    function changePrice(county) {
      let priceList = main_price[county.toLowerCase()];
      if (county.toLowerCase() == "by") {
        $("i.val").text(priceList[0]);
        $("i.price1").text(priceList[1]);
        $("i.price2").text(priceList[2]);
        $("i.price3").text(priceList[3]);
        $("i.price4").text(priceList[4]);    
      }
    }


    /*валидация на пустоту*/
    $('.main-form button').click(function() {
      var form = $(this).parent().parent();
      /*валидация на пустоту*/
      $(form).find('.required').each(function() {
        if ($(this).val().trim() === '' || $(this).val().indexOf(' ') >= 0) {
          $(this).addClass('invalid');
        } else {
          $(this).removeClass('invalid');
        }
      });
    });



    var isFormSubmitted = false;
    /*отправка формы*/
    $('.main-form').submit(function(event) {
      event.stopPropagation();
      event.preventDefault();

      if (isFormSubmitted) {
        return false;
      }
      
      /*валидация номера на кооректность*/
      let inp_name = $(this).find("input[name=name]")[0];
      let inp_phone = $(this).find("input[name=phone]")[0];
      let inp_messenger = $(this).find("input[name=messenger]")[0];

      if ($(inp_messenger).val()) {
        console.log("msg tg +");
      } else if (inp_phone){
        if (iti.isValidNumber()) {
          console.log("телефон есть и он корректный");
        } else {
          input.classList.add("invalid");
          return false;
        }
        if ($(inp_name).val().trim()) {
          console.log("телефон есть и имя не пустое");
        } else {
          inp_name.classList.add("invalid");
          return false;
        }
      }

      // if (inp_phone){;
      //     if (iti.isValidNumber() || $(inp_messenger).val()) {
      //       console.log("number ok");
      //   }
      //   else {
      //       input.classList.add("invalid");
      //       return false;
      //   }
      // }

      let form = this,
          data = new FormData(),
          files = $('input[type=file]')

      if ($(inp_name).val()) {
          data.append( 'name', 		$('[name="name"]', form).val() );
      }
      if ($(inp_phone).val()) {
          data.append( 'phone', 		iti.getNumber() );
      }
      if ($(inp_messenger).val()) {
          data.append( 'messenger', 	$('[name="messenger"]', form).val() );
      }
      if ($(form).find("input[name=comment]")[0].value) {
          data.append( 'comment', 	$('[name="comment"]', form).val() );
      }


      files.each(function (key, file) {
          let cont = file.files;
          if ( cont ) {
              $.each( cont, function( key, value ) {
                  data.append( key, value );
              });
          }
      });

      isFormSubmitted = true;
      $.ajax({
          url: 'ajax.php',
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          xhr: function() {
              let myXhr = $.ajaxSettings.xhr();

              if ( myXhr.upload ) {
                  myXhr.upload.addEventListener( 'progress', function(e) {
                      if ( e.lengthComputable ) {
                          let percentage = ( e.loaded / e.total ) * 100;
                              percentage = percentage.toFixed(0);
                          $('.submit', form)
                              .html( percentage + '%' );
                      }
                  }, false );
              }

              return myXhr;
          },
          error: function( jqXHR, textStatus ) {
              // Тут выводим ошибку
          },
          complete: function() {
            // Тут можем что-то делать ПОСЛЕ успешной отправки формы
            form.reset()
            isFormSubmitted = false;
            document.location.href = "./thank.php"
              // $(form).find(".success_message").slideDown();
              setTimeout(function() {
                // $(form).find(".success_message").slideUp();
              }, 1500);
          }
      });

      return false;
      });


});

