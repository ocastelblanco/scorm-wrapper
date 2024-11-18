/**
 * Saves state, score and location of SCORM package
 */
function sendSCORMScore(terminateScorm) {
    var end = new Date().getTime();
    var allPagesVisited = false;

    // This ensures that Player knows to update score before leaving page, event for score type FIRST.
    if (player.hasOwnProperty('forceScoreUpdate')) {
        player.forceScoreUpdate();
    }

    var ps = player.getPlayerServices();
    var utils = new PlayerUtils(player);
    var presentation = utils.getPresentation();

    var score = utils.getPresentationScore(presentation);
    for (var i = 0; i < score.paginatedResult.length; i++) {
        var s = score.paginatedResult[i];
        scorm.setPageName(i, 'Page_' + s.page_number);
        scorm.setPageMinScore(i, 0);
        scorm.setPageMaxScore(i, 1);
        scorm.setPageRawScore(i, s.score);
        scorm.setPageScaledScore(i, s.score);
    }

    var _rawscore = score.scaledScore * 100;
    var rawscore = Math.round(_rawscore);

    if (presentation) {
        allPagesVisited = checkAllReportablePagesVisited(presentation);
    }

    scorm.setMinScore(0);
    scorm.setMaxScore(100);
    scorm.setRawScore(rawscore);
    scorm.setScaledScore(_rawscore / 100);
    scorm.setSessionTime(end - start);
    scorm.saveState(player.getState());
    scorm.saveLocation(ps.getCurrentPageIndex());

    if (allPagesVisited) {
        scorm.setCompleted();
    } else {
        scorm.setIncomplete();
    }

    if (allPagesVisited && passingScore && !isNaN(passingScore)) {
        if (passingScore <= rawscore) {
            scorm.setPassed();
        } else {
            scorm.setFailed();
        }
    }

    scorm.commitScormCommunication();
    if (terminateScorm) {
        scorm.terminateScormCommunication();
    }
}

/**
 * Start listen window events for Scorm
 * @method listenWindowEventsScorm
 */
function listenWindowEventsScorm() {
    if (window.frameElement !== null && navigator.userAgent.indexOf("Chrome") > -1) {
        window.addEventListener("beforeunload", sendSCORMScore.bind({}, true), false);
    } else if ("onpagehide" in window) {
        window.addEventListener("pagehide", sendSCORMScore.bind({}, true), false);
    } else {
        window.addEventListener("beforeunload", sendSCORMScore.bind({}, true), false);
    }
}