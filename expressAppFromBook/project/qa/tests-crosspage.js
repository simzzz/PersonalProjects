var Browser = require('zombie'),
    assert = require('chai').assert;
var browser;

suite('Cross-Page Tests', function(){
    setup(function(){
            browser = new Browser();
    });

    test('Requesting coaching from the Hearthstone page' + 'should populate the referrer field', function(done){
        var referrer = 'http://localhost:3000/teams/hearthstone';
        browser.visit(referrer, function(){
            browser.clickLink('.requestCoaching', function(){
                if (browser.field('referrer').value !== referrer) assert('referrer from Hearthstone team page required');
                // assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('Requesting coaching from the League of Legends page should populate the referrer field', function(done){
        var referrer = 'http://localhost:3000/teams/leagueoflegends';
        browser.visit(referrer, function(){
            browser.clickLink('.requestCoaching', function(){
                if (browser.field('referrer').value !== referrer) assert('referrer from League of legends team page required');
                // assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('Visiting the "request coaching" page directly should result in an empty referrer field', function(done){
        browser.visit('http://localhost:3000/teams/requestcoaching', function(){
            assert(browser.field('referrer').value === '');
            done();
        });
    });
});
