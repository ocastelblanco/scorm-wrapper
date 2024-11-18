/*! The MIT License (MIT)
Copyright © 2017 Andrzej Krawczyk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */


(function (window) {
    var isSamsungBrowserRegExp = new RegExp('SamsungBrowser', 'gi');
    var currentScreenSizes;
    
    function getSizesStruct(width, height, orientation) {
        if (!orientation) {
            orientation = ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE;
        }
        
        return {
            "height": height,
            "width": width,
            "orientation": orientation
        };
    }

    function portraitScreenSizes(screenWidth, screenHeight) {
        return {
            width: Math.min(screenWidth, screenHeight),
            height: Math.max(screenWidth, screenHeight)
        };
    }
    
    function landscapeScreenSizes(screenWidth, screenHeight) {
        return {
            width: Math.max(screenWidth, screenHeight),
            height: Math.min(screenWidth, screenHeight)
        };
    }
    
    function ScreenUtils () {}
    
    ScreenUtils.isMobileUserAgent = function (userAgent) {
        if (userAgent === undefined || !userAgent) {
            return false;
        }
        
        var mobile_agent = userAgent.match(/Android/i) ||
          userAgent.match(/BlackBerry/i) ||
          userAgent.match(/iPhone|iPad|iPod/i) ||
          userAgent.match(/IEMobile/i) ||
          userAgent.match(/Opera Mini/i);
        
        if (mobile_agent || ScreenUtils.isIpadAsDesktop(userAgent)) {
            return true;
        } else {
            return false;
        }
    };

     ScreenUtils.isIpadAsDesktop = function (userAgent) {
         return userAgent.match(/Macintosh/i) && 'ontouchend' in document;
     }

    
    ScreenUtils.isSamsungBrowser = function (userAgent) {
        if (userAgent === undefined || !userAgent) {
            return false;
        }
        
        return isSamsungBrowserRegExp.test(userAgent);
    };
    
    ScreenUtils.ORIENTATION_TYPES = {};
    ScreenUtils.ORIENTATION_TYPES.NOT_MOBILE = "NOT_MOBILE";
    ScreenUtils.ORIENTATION_TYPES.PORTRAIT = "PORTRAIT";
    ScreenUtils.ORIENTATION_TYPES.LANDSCAPE = "LANDSCAPE";
    
    ScreenUtils.orientationType = function () {
        var isAndroid = /(android)/i.test(navigator.userAgent);
        if (isAndroid) {
            if(window.innerWidth > window.innerHeight){
                return ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;
           } else {
                return ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
           }
        } else {
            if(window.orientation == 0 || window.orientation == 180) {
                //portrait mode iOS and other devices
                return ScreenUtils.ORIENTATION_TYPES.PORTRAIT;
            } else {
                return ScreenUtils.ORIENTATION_TYPES.LANDSCAPE;
            }
        }
    };
    
    ScreenUtils.getScreenSizesDependingOnOrientation = function (userAgent, orientationTypes) {
        var orientationData = orientationTypes || getOrientation(userAgent);
        
        if (orientationData.isMobile && orientationData.isPortrait) {
            var screenSizes = portraitScreenSizes(window.screen.width, window.screen.height);
            return getSizesStruct(screenSizes.width, screenSizes.height, orientationData.screenOrientation);
        } else if (orientationData.isMobile && orientationData.isLandscape) {
            var screenSizes = landscapeScreenSizes(window.screen.width, window.screen.height);
            return getSizesStruct(screenSizes.width, screenSizes.height, orientationData.screenOrientation);
        }
        
        return getSizesStruct($(window).width(), $(window).height());
    };
    
    ScreenUtils.getViewPortAndIframeSizes = function (iframeContentWidth, iframeContentHeight, userAgent) {
        var viewPortWidth = iframeContentWidth;
        var viewPortHeight = iframeContentHeight;
        var orientationTypes = getOrientation(userAgent);

        if (orientationTypes.isMobile) {
            var screenSizes = window.mAuthor.ScreenUtils.getScreenSizesDependingOnOrientation(userAgent, orientationTypes);
            var ratio = screenSizes.width / iframeContentWidth;
            var heightRatio = ratio * iframeContentHeight;
            
            if (heightRatio < screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = "device-height";
            } else if (heightRatio === screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = iframeContentHeight;
            } else if (heightRatio > screenSizes.height) {
                viewPortWidth = iframeContentWidth;
                viewPortHeight = iframeContentHeight;
            }
        }
        
        return {
            iframeWidth: iframeContentWidth,
            iframeHeight: iframeContentHeight,
            viewPortWidth: viewPortWidth,
            viewPortHeight: viewPortHeight
        };
    };
    
    function getOrientation(userAgent) {
        var screenOrientation = ScreenUtils.orientationType();
        return {
            isMobile: ScreenUtils.isMobileUserAgent(userAgent),
            screenOrientation: screenOrientation,
            isPortrait: screenOrientation === ScreenUtils.ORIENTATION_TYPES.PORTRAIT,
            isLandscape: screenOrientation === ScreenUtils.ORIENTATION_TYPES.LANDSCAPE
        };
    }

    // This method needs to be run on pageload
    // in order to initialize currentScreenSizes value
    ScreenUtils.isSoftKeyboardResize = function() {
        var width = window.screen.width;
        var height = window.screen.height;

        if (currentScreenSizes === undefined){
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        if (math.abs(currentScreenSizes.width - width) > currentScreenSizes.width / 20) {
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        if (math.abs(currentScreenSizes.height - height) > currentScreenSizes.height / 20) {
            currentScreenSizes = {width:width, height:height};
            return false;
        }

        currentScreenSizes = {width:width, height:height};
        return true;
    };
    
    window.mAuthor = window.mAuthor || {};
    window.mAuthor.ScreenUtils = window.mAuthor.ScreenUtils || ScreenUtils;
})(window);

function mobileCheck() {
	  let check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
};