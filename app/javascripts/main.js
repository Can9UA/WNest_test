'use strict';
// Consts.
var LOADER_FADE_TIME = 200;

// Data members.
var _articleTextSwiper;

// Occures when ready.
$(document).ready(function () {
  console.log('ready');

  // mobile nav
  $('.close-btn').click(function () {
        $('.menu-content').removeClass('active');
    });
  
  $('.menu-button').click(function () {
        //console.log("open menu");
        $('.menu-content').addClass('active');
    });
    
  initQuestionsFunctionality();
});



// Registers the sliders.
function RegisterSliders() {
    if ($(window).width() > 1024) {
        var swiper = new Swiper('.questions-menu .swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 2,
            slidesPerColumn: 3,
            //slidesPerGroup: 3,
            //slidesPerColumnFill: 'row',
            paginationClickable: true,
            spaceBetween: 15,
            nextButton: '.swiper-button-prev',
            prevButton: '.swiper-button-next',
            onSlideChangeStart: function(swiper) {
                //dataLayer.push({ 'Category': 'מה תרצו לדעת', 'Action': 'דפדוף', 'Label': '', 'event': 'auto_event' });
            }
        });
    }

}

function initQuestionsFunctionality() {
  if (typeof $ !== 'function') return false;
  
  const body = $('body');
  
  const questionsHolder = body.find('.swiper-wrapper');
  if (!questionsHolder.length) return false;
  
  const questinTempalte = questionsHolder.find('[data-question-template]').html();
  const popups = {
    answer: body.find('#answer-modal')
  };
  
  if (!questinTempalte.length) return false;
  
  let questionsData = [];
  
  // getQuestions function accepts the array of callbacks
  // that are executed when the request is successfully terminated
  getQuestions([
    addQuestions,
    RegisterSliders,
    addHandlers
  ]);
  
  //////////

  // accepts the array of callbacks that are executed when the request is successfully terminated
  function getQuestions(callbacks) {
    $.ajax({
      type: "GET",
      dataType: 'JSON',
      cache: false,
      url: "http://devdino.com/tests/js/GetQuestions.ashx"
    })
      .done(function (data) {
        if (!data.length) {
          console.warn('No questions!');
          
          return false;
        }
        
        questionsData = data;
        
        if (typeof callbacks === 'function') {
          callbacks();
        } else if (Array.isArray(callbacks)) {
          for (let callback of callbacks) {
            if (typeof callback === 'function') {
              callback();
            }
          }
        }
      })
      .error(function (jqXHR, textStatus, errorThrown) {
        console.warn(`Status: ${textStatus} \n Error: ${errorThrown}`);
      });
  }
  
  function addQuestions(questions = questionsData) {
    for (let question of questions) {
      let questionHTML = fillInTemplate(questinTempalte, question);

      questionHTML = $(questionHTML);
      questionHTML.data('id', question.id);
      questionsHolder.append(questionHTML);
    }
  }
  
  function fillInTemplate(template, data) {
    for (let prop in data) {
      template = template.replace('{{' + prop + '}}', data[prop]);
    }

    return template;
  }
  
  function addHandlers() {
    questionsHolder.on('click', '.swiper-slide', function (e) {
      e.preventDefault();
      let guestion = $(this);
      let guestionId = guestion.data('id');
      
      updateQuestionCounter(guestionId);
      
      fillInPopupData(
        popups.answer,
        getElementFromArr(questionsData, {id: guestionId})
      );
      
      popups.answer.modal('show');
    })

    const select = body.find('#questionInput');
    
    if (select.length) {
      select.autocomplete({
        source: function (request, response) {
          let re = $.ui.autocomplete.escapeRegex(request.term);
          let matcher = new RegExp(re, "i");
          
          response($.grep(
            ($.map(questionsData, function (question, i) {
              return {
                label: question.name,
                value: question.id,
                keywords: question.keywords
              };
            })),
            function (question) {
              return isQuestionMatch(question, matcher)
            }
          ))
        }
      })
      .on("autocompleteselect", function(event, ui) {
        console.log(ui);
        fillInPopupData(
          popups.answer,
          getElementFromArr(questionsData, {id: ui.item.value})
        );

        popups.answer.modal('show');
      });
    }
  }
  
  function updateQuestionCounter(id) {
    $.post(`http://devdino.com/tests/js/GetQuestion.ashx?id=${id}`,
      {},
      function (response) {
        console.log(`Data dended to devdino.com, with id = "${id}"`);
      }
    );
  }
  
  function fillInPopupData(popup, data = {}) {
    for (let field in data ) {
      popup.find(`[data-question="${field}"]`)
        .text(data[field]);
    }
  }
  
  // get element from array according to filter parametrs
  function getElementFromArr(arr = [], parametrs = {}) {
    for (let paramName in parametrs) {
      for(let item of arr) {
        if (item[paramName] === parametrs[paramName]) {
          return item;
        }
      }
    }

    return undefined;
  }
  
  function isQuestionMatch(question, matcher) {
    for (let keyword of question.keywords) {
      if (matcher.test(keyword)) return true;
    }
  }
}

