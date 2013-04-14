/*=====================
phil@riotindustries.com
March 2013
=====================*/


var thePortfolio;
var hash = window.location.hash.slice(1).replace(/%20/g, " ");

$(document).ready(function(){
    //console.log('document ready');

    //set variables to determine if scripts for a particular environment need to be called.
    mobileEnvironment = 1;
    tabletEnvironment = 0;
    desktopEnvironment = 0;

    $('body').addClass('mobile'); //assume mobile! mobile first, yo.

    universalController();

    environmentChecker();
    $(window).resize(function(){
        environmentChecker();
    });

}); //document.ready


/*==( ^ Checks to see if Mobile, Tablet, or Desktop )======================================================*/

function environmentChecker() {
    //console.log('environmentChecker `fired');

    if ($(window).width() >= 960) {
        if (tabletEnvironment == 0){
            tabletEnvironment = 1;
            tabletController();
        }; //tabletcheck
        if (desktopEnvironment == 0){
            desktopEnvironment = 1;
            //desktopController(); 
        }; //desktopcheck
        $('body').removeClass('mobile').removeClass('tablet').addClass('desktop');
    } else if ($(window).width() >= 600) {
        if (tabletEnvironment == 0){
            tabletEnvironment = 1;
            tabletController();
        }; //tabletcheck
        $('body').removeClass('mobile').removeClass('desktop').addClass('tablet');
    } else {
        $('body').removeClass('tablet').removeClass('desktop').addClass('mobile');
    }; //window.width

    heightSetter();

}; //environmentChecker


/*==( ^ Call universal functions. Not dependent on tablet/desktop, etc.
Most of these are in .length-called if statements. This helps us avoid
loading unecessary javascript only to find that there are no suitable
DOM elements to run on.
)======================================================*/

function universalController(){

    mobileNavHelper();
    navHandler();
    panelHandler();
    projectHandler();
    getPortfolio();

}; //universalController

/*==( ^ Call tablet-specific functions
)======================================================*/

function tabletController(){

    parallaxHandler();

}; //tabletController

/*==( ^ Take all instances of navigation on interior pages
and move them to a secluded area that is opened by clicking the top-right orange button.
Emulates facebook/other social network behaviour. In the future, this might want to be touch/drag sensitive.
)======================================================*/

function mobileNavHelper(){
    //console.log('mobileNavHelper fired');
    $('header').append('<div class="mobilenavcontainer"></div>');
    $('header nav').clone().appendTo('.mobilenavcontainer');

    $('header').prepend('<a class="mobilenavbutton">Explore</a>');
    $('.mobilenavbutton').on('click', function(){
        showMobileNav();
        return false;
    }); //toggle mobile nav button

    // $('.mobilenavcontainer').prepend('<a href="#" class="closebutton">Close Menu</a>');

    $('.closebutton').click(function(){
        hideMobileNav();
        return false;
    })

}; //mobileNavHelper

function showMobileNav(){
    //console.log('showMobileNav fired');
    $('.mobilenavcontainer').addClass('open');
    $('.mobilenavbutton').addClass('open');
    //$('header').addClass('topspin')
            $('.mobilenavcontainer nav').children('a').each(function(i){
                timeouter = setTimeout(function(){
                    $('.mobilenavcontainer nav').children('a').eq(i).addClass('open');
                },200*i)
            });
    $('.mobilenavbutton').off('click');
    $('.mobilenavbutton').on('click', function(){
        hideMobileNav();
        return false;
    }); //toggle
}; //showMobileNav


function hideMobileNav(){
    //console.log('hideMobileNav fired');
    clearTimeout(timeouter);
    $('.mobilenavcontainer').removeClass('open');
    $('.mobilenavbutton').removeClass('open');
    $('.mobilenavcontainer nav').children('a').each(function(i){
        setTimeout(function(){
            $('.mobilenavcontainer nav').children('a').eq($('.mobilenavcontainer nav a').length-(i+1)).removeClass('open');
        },200*i)
    });
    $('.mobilenavbutton').off('click');
    $('.mobilenavbutton').on('click', function(){
        showMobileNav();
        return false;
    }); //toggle
}; //hideMobileNav


/*==( ^ Roly Poly Crazy Navigation. TM.
)======================================================*/

function navHandler(){
    //console.log('navHandler fired');

    $('nav').children('a').click(function(){
        //$('header').addClass('topspin');
        if ($(this).attr('href')=="#"){            
            if (  $('#'+$(this).html()).length){
                if ($('body').is('.mobile')){
                    $('html, body').stop().animate({'scrollTop':$('#'+$(this).html()).offset().top}, {duration: 500, easing:'easeOutExpo'});
                } else {
                    $('html, body').stop().animate({'scrollTop':$('#'+$(this).html()).offset().top-90}, {duration: 1500, easing:'easeOutExpo'});
                }; //if mobile
            } else {
                $('header').addClass('topspin');
            }
            return false;
        }; //if it's not, like, an actual link.
    })
    $('.top').click(function(){
        $('header').toggleClass('topspin');
    })
    $('.front').click(function(){
        $('header').toggleClass('topspin');
    })
    $('.top').find('a').click(function(evt){
        evt.stopPropagation();
    })


}; //navHandler






function parallaxHandler(){
    //console.log('parallaxHandler fired');

    $(window).scroll(function(i){
        //console.log($(window).scrollTop());
        var scrollVar = $(window).scrollTop();
        $('section#about').children('video').css({'top': 1.5*scrollVar });
        $('section#about .inner').children('h2').css({'top': .7*scrollVar });

        if (scrollVar > 350) {
            $('header').addClass('fixedtop');
        } else {
            $('header').removeClass('fixedtop');
        }

    })

}; //parallaxHandler






/*==( ^ Make sure your panels are as wide as the screen.
Called initially, and then again at the time a new project is loaded.
)======================================================*/

function setPanelWidth(){
    $('.panel').css({'width':$(window).width(), 'height':$(window).height()});
    $('.expanded-project').css({'height':$(window).height()});
    $('.panel').children('img').attr({'draggable':'false'}); //prevent ghosting
}

function panelHandler(){

    $('.panel-container').bind('mousedown touchstart', function(ev){
        $('.panel-container').stop();
        initialValue = $(this).offset().left;
        initialTop = $('body').scrollTop();
          ev.preventDefault();
    });

    $$('.panel-container').swiping(function(ev){
        initialTouchPoint = ev.iniTouch.x;
        //console.log(ev);
        $(this).css({'left':initialValue-initialTouchPoint+(ev.currentTouch.x)});
        //$('body').scrollTop(initialTop-((ev.iniTouch.y-ev.currentTouch.y)*.9));
        ev.preventDefault();
        ev.stopPropagation();
        return false;
        //console.log(ev.currentTouch.x);
    }); //drag

    $('.panel-container').on('mouseup, touchend', function(ev){
        console.log(ev)
        ev.preventDefault();
    })

    $$('.panel-container').swipeUp(function(ev){
        console.log('just scroll man');
        ev.preventDefault();
    }); //swipe

    $$('.panel-container').swipeLeft(function(ev){
        headLeft();
        ev.preventDefault();
    }); //swipe

    jQuery.fn.reverse = [].reverse;

    $$('.panel-container').swipeRight(function(ev){
        headRight();
        ev.preventDefault();
    }); //swipe


}; //panelHandler


function headLeft(){
    var heading = false;
    $('.panel-container').children('.panel').each(function(i){
        if ($(this).offset().left >= 0) {
            headTo($(this));
            heading = true;
            return false;
        }; //if
    });
    if (heading == false) {
        headTo($('.panel-container').children('.panel:last-child'))
    }; //if heading==false
}

function headRight(){
    var heading = false;
    $('.panel-container').children('.panel').each(function(i){
        if ($(this).offset().left+$(this).width() >= 0) {
            headTo($(this));
            heading = true;
            return false;
        }; //if
    }); 
    if (heading==false){
        headTo($('.panel-container').children('.panel:first-child'))
    }; //if heading==false
}


function headTo(destination){
    destination.parent('.panel-container').animate({'left':-destination.position().left}, 500, 'easeOutQuint');
}; //headTo

function projectHandler(){
    $(document).on('click', '.project', function(){
        if ($(this).hasClass('expanded')) {
            $(this).removeClass('expanded');
            condenseProject($(this));
        } else {
            $(this).addClass('expanded');
            $(this).siblings('.expanded').removeClass('expanded');
            loadProject($(this), $(this).data('name'));
        }
    }); //on .project click
    $(document).on('click', '.close-project', function(){
        $('.project.expanded').click();
        return false;
    }); //on .close-project click


$(document).keyup(function(e) {
    if ($('.project.expanded').length){
        if (e.keyCode == 27) { $('.close-project').click(); }   // if ESC is pushed
        if (e.keyCode == 37 || e.keyCode == 38) {
            $('.panel-container').css({'left': $('.panel-container').offset().left+10})
            headRight();
        }   // left arrow pressed
        if (e.keyCode == 39 || e.keyCode == 40) {
            $('.panel-container').css({'left': $('.panel-container').offset().left-10})
            headLeft();
        }   // right arrow pressed
    }; //if a project's open
});

}; //projectHandler




/*==( ^ Loads a project from portfolio.json based on the data-name of
the .project you clicked. Makes sure everything's good to go, then calls
the expandProject function.
)======================================================*/

function loadProject(project, projectName){
    window.location.hash = projectName;
    $('.panel-container').css({'left':'0px'}).children().remove();
    $.each(thePortfolio[projectName].images, function(i){
        $('.panel-container').append('<div class="panel"><img src="/assets/images/projects'+thePortfolio[projectName].images[i]+'" /></div>');
    });
    if (thePortfolio[projectName].abstract != "") {
        $('.panel-container').append('<div class="panel"><p>'+thePortfolio[projectName].abstract+'</p></div>');    
    }; //if the abstract ain't blank
    setPanelWidth();
    expandProject(project);
}; //loadProject


/*==( ^ Expands the project; does the animation lifting.
)======================================================*/

function expandProject(project){
    $('body').css({'overflow':'hidden'});
    setPanelWidth();
    $(project).siblings('.project').animate({'opacity':'0'}, 500);
    $(project).animate({'width':$(window).width()}, 500, function(){
        $(project).animate({'paddingBottom':'1200px'}, 500);
        $('#container > header').animate({'marginTop':'-300px'}, 250, function(){
            $('html,body').animate({'scrollTop':$(project).offset().top}, 500, function(){    
                $('.expanded-project').stop().animate({'left':'0px'}, {duration: 500, easing:'easeInOutExpo'});
            });
        });
    });
}; //expandProject

/*==( ^ Condenses the project; does the animation lifting.
)======================================================*/

function condenseProject(project){
    $(project).animate({'paddingBottom':'0px'}, 500);

    $('.expanded-project').stop().animate({'left':'100%'}, {duration: 500, easing:'easeInOutExpo'});

    setTimeout(function(){
        $(project).siblings('.project').animate({'opacity':'1'}, 500);
        if ($('body').is('.mobile')){
        $(project).animate({'width':'100%'}, 500);
        } else {
        $(project).animate({'width':'80%'}, 500);
        }
        $('#container > header').animate({'marginTop':'0px'}, 500);
        $('body').css({'overflow':'auto'});
        window.location.hash = "?";
    },500)

}; //condenseProject




function heightSetter(){
    //alert($(window).height());
    //$('.expanded-project').css({'height':$(window).height()});
}; //heightSetter




function getPortfolio(){
    $.getJSON('/assets/js/portfolio.json', function(data) {
        thePortfolio = data;


        if (hash!=""){
            if ($('.project[data-name="'+hash+'"]').length){
                $('.project[data-name="'+hash+'"]').click();
            }
        }; //if hash



    });
}; //getPortfolio








