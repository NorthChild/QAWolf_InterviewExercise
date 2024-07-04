// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const selectors = require('./Selectors/selectors.json');
  const interactions = require('./Interactions/interactions.js');
  const assert = require('assert');

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // for selectors debugging purposes, to confirm elements are indeed found in the page
  // await interactions.highlightElement(page, selectors.orderedPostNumber);
  // await interactions.highlightElement(page, selectors.minutesSincePost);
  // await interactions.highlightElement(page, selectors.newButtonPostNumber);
  // await interactions.highlightElement(page, selectors.moreButton);

  // Cases: 
  // GIVEN the user wants the articles to be ordered by latest WHEN the user clicks on the "New" button THEN the articles will be ordered by latest
  // GIVEN the posts have a timestap to when they were posted WHEN we compare one post to the one after THEN the first post timestamp will be smaller or the same as the following post (in case a new post is added at the same time)

  // we click on the new button so to order the posts by latest
  await page.click(selectors.newButton);

  try {
    let orderedPostNumber = 101;
    let attempts = 0;
    let uniquePostNumbers = new Set();
    let postIterations = 0;
    let previousTime = 0;

    while (attempts < 10 && orderedPostNumber !== 100) {
      // find the posts, specifically their post order and the time since posted 
      const elements = await page.$$(selectors.orderedPostNumber);
      const postTime = await page.$$(selectors.minutesSincePost);

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const postTimeElement = postTime[i];

        let postOrderNumber = await element.innerText();
        let timePastSincePost = await postTimeElement.innerText();

        orderedPostNumber = parseInt(postOrderNumber, 10);
        if (!isNaN(orderedPostNumber)) {
          uniquePostNumbers.add(orderedPostNumber);
          postIterations++;
          // console.log(`Post number: ${orderedPostNumber}, Time since post: ${timePastSincePost}`); // for debugging purposes
          let currentTime = interactions.parseTimeToMinutes(timePastSincePost);
          assert(parseInt(previousTime) <= parseInt(currentTime), 'Posts are not ordered correctly');
          previousTime = currentTime;

          if (orderedPostNumber === 100) {
            console.log("Reached post number 100, stopping.");
            break;
          }
        }
      }
      
      // if we re not done checking the first 100 posts, we move to the next page
      if (orderedPostNumber !== 100) {
        await page.click(selectors.moreButton);
        await page.waitForTimeout(1000);
      } else {
        break;
      }

      attempts++;
    }

    assert.strictEqual(uniquePostNumbers.size, postIterations, 'The number of unique posts does not match the total posts processed.');
    console.log(`Final count of unique posts: ${uniquePostNumbers.size}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }

  // Close browser when done
  page.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
