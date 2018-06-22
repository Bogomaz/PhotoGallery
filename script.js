/*ВОПРОС: что делать, если в галерее много картинок. Как оптимизировать и ускорить работу страницы?*/
function Slider( element ){
    this.element = document.querySelector(element);
    this.init();
}

Slider.prototype = {
    init: function(){
        this.wrapper = this.element.querySelector("#slider-wrapper");   // окно, в котором отображается текущий слайд
        this.links = this.element.querySelectorAll("#slider-nav a");    // все ссылки с миниатюрами
        this.miniature = this.element.querySelector("#native-nav");     // обёртка, в которой миниатюры
        this.buttonPreview = this.element.querySelector("#prew");       // кнопка "Предыдущее изображение"
        this.buttonNext = this.element.querySelector("#next");          // кнопка "Следующее изображение"
        this.buttonPrevSection = this.element.querySelector("#prew-section");   // кнопка "Предыдущая секция"
        this.buttonNextSection = this.element.querySelector("#next-section");   // кнопка "Следующая секция"

        /*TODO: Это должно конфигурироваться пользователем компонента*/
        this.sectionCount = 5;
        this.activeSlideNumber = 0;
        /*----------------------------------------------------------*/
        this.setEventListeners();
    }
    //функция навешивает события на все рабочие элементы
    ,setEventListeners: function(){
        var self = this;
        this.buttonPreview.addEventListener("click", function(event){   //Кнопка "Предыдущее изображение"
            event.preventDefault();
            self.scroll("prev");
        });
        this.buttonNext.addEventListener("click", function(event){      //Кнопка "Следующее изображение"
            event.preventDefault();
            self.scroll("next");
        });
        this.buttonPrevSection.addEventListener("click", function(event){//Кнопка "Предыдущая секция"
            event.preventDefault();
            self.scroll("prev_section");
        });
        this.buttonNextSection.addEventListener("click", function(event){//Кнопка "Следующая секция"
            event.preventDefault();
            self.scroll("next_section");
        });

        for(var i = 0; i < this.links.length; i++){             //Все картинки-миниатюры для нативной навигации
            var link = self.links[i];
            link.addEventListener("click", function(event){
                event.preventDefault();
                self.scroll("native_click");
            });
        }
    }
    /*Функция scroll: принимает тип пролистывания: вперёд/назад на одну; вперёд/назад на 5; клик на конкретную фотку
    * Функция проматывает до нужной картинки в области просмотра фото
    * Функция проматывает до нужной картинки в списке миниатюр
    * */
    ,scroll: function(scrollType){
        this.activeSlideNumber = this.defineNewActiveSlideNumber(scrollType, this.activeSlideNumber);
        var slide = this.element.querySelector(".slide[data-slide=\""+this.activeSlideNumber+"\"]");
        this.wrapper.style.left = "-"+slide.offsetLeft+"px";

        var link = this.element.querySelector("#native-nav [data-slide=\""+this.activeSlideNumber+"\"]");
        this.miniature.style.left = "-"+link.offsetLeft+"px";

        this.setCurrentLink(link);
    }

    /*Функция определяет номер слайда, который нужно показывать после действия пользователя*/
    ,defineNewActiveSlideNumber: function(scrollType){
        switch(scrollType){
            case "next":{
                if(this.activeSlideNumber + 1 > this.links.length){
                    return this.activeSlideNumber;
                }
                return this.activeSlideNumber + 1;
            };
            case "prev":{
                if(this.activeSlideNumber - 1 <= 0){
                    return this.activeSlideNumber;
                }
                return this.activeSlideNumber - 1
            };
            case "next_section":{
                if(this.activeSlideNumber + this.sectionCount >= this.links.length){
                    return this.activeSlideNumber;/*this.links.length;*/
                }
                return this.activeSlideNumber + this.sectionCount;
            };
            case "prev_section":{
                if(this.activeSlideNumber - this.sectionCount <= 0){
                    return 0;
                }
                return this.activeSlideNumber - this.sectionCount;
            };
            case "native_click":{
                return +event.target.parentNode.getAttribute("data-slide");
            }
        }
    }

    ,setCurrentLink: function(link){
        var parent = link.parentNode;
        var a = parent.querySelectorAll("a");
        for(var i = 0; i < a.length; i++){
            a[i].className = "";
        }
        link.className = "current";
    }
}
document.addEventListener( "DOMContentLoaded", function() {
    var aSlider = new Slider( "#slider" );
});