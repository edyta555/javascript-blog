{
  'use strict';
  
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';
    
    /* for each article */
    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element and get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into titleList */
      html = html + linkHTML;
      /*another way: titleList.insertAdjacentHTML('beforeend', linkHTML); */
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
	
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags){
    /* return the largest and smallest number of instances of the same tag */
    const params = {'max' : 0, 'min' : 999999};
    for(let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  }

  function calculateTagClass(count,params){
    /* return the size of the tag link based on the frequency of tags in the articles */
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return classNumber;
  }

  function generateTags(){
    /* create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){

      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      tagsWrapper.innerHTML = '';

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){
        /* generate HTML of the link */
        const linkTag = '<li><a href="#tag-' + tag + '">' + tag + '&nbsp' +'</a></li>';

        /* add generated code to html variable */
        html = html + linkTag;
        
        /* check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)){

          /* add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }  
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
     
    /* END LOOP: for every article: */
    }
    /* find list of tags in right column */
    const tagList = document.querySelector('.tags');
    
    /*return the object with the largest and smallest number of instances of the same tag */
    const tagsParams = calculateTagsParams(allTags);

    /* create variable for all links HTML code */
    let allTagsHTML = '';

    /* START LOOP: for each tag in allTags: */
    for(let tag in allTags){

      /* return the size of the tag link based on the frequency of tags in the articles */
      const tagSize = optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams);

      /* generate code of a link and add it to allTagsHTML */
      allTagsHTML += '<li><a class="' + tagSize + '" href="#tag-' + tag + '">' + tag + '</a>' + '<span>(' + allTags[tag] + ')&nbsp</span></li>';
    /* END LOOP: for each tag in allTags: */
    }
    /* add html from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }
  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-','');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    
    /* START LOOP: for each active tag link */
    for(let activeTagLink of activeTagLinks){

      /* remove class active */
      activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for(let tagLink of tagLinks){

      /* add class active */
      tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(selector){
    /* find all links to tags */
    const linksTag = document.querySelectorAll(selector);

    /* START LOOP: for each link */
    for (let linkTag of linksTag) {

      /* add tagClickHandler as event listener for that link */
      linkTag.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
    }
  }
  /* for tags under articles */
  addClickListenersToTags('.post-tags a');
  /* for tags in the sidebar */
  addClickListenersToTags('.list.tags a');
  
  function generateAuthors(){
    /* create a new variable allAuthors with an empty array */
    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){
      
      /* find author wrapper */
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
     
      /* get author from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');
      
      /* generate HTML of the link */
      const linkAuthor = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

      /* check if this link is NOT already in allAuthors */
      if(!allAuthors.hasOwnProperty(articleAuthor)){

        /* add author to allAuthors object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
     
      /* insert HTML of all the links into the tags wrapper */
      authorWrapper.innerHTML = linkAuthor;

    /* END LOOP: for every article: */
    }

    /* create variable for all links HTML code */
    let allAuthorsHTML = '';

    /* find list of authors in right column */
    const authorList = document.querySelector('.authors');
    
    /*return the object with the largest and smallest number of instances of the same author */
    const authorsParams = calculateTagsParams(allAuthors);

    /* START LOOP: for each author in allAuthors */
    for(let author in allAuthors){

      /* return the size of the link based on the frequency of links in the articles */
      const authorSize = optCloudClassPrefix + calculateTagClass(allAuthors[author], authorsParams);

      /* generate code of a link and add it to allArticleHTML */
      allAuthorsHTML += '<li><a class="' + authorSize + '" href="#author-' + author + '">' + author + '</a>' + '<span>(' + allAuthors[author] + ')&nbsp</span></li>';

    }
    /*add HTML from allAuthorsHTML to AuthorList */
    authorList.innerHTML = allAuthorsHTML;
  }
  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-','');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    
    /* START LOOP: for each active author link */
    for(let activeAuthorLink of activeAuthorLinks){
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found author link */
    for(let authorLink of authorLinks){

      /* add class active */
      authorLink.classList.add('active');

    /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(selector){
    /* find links to authors */
    const linksAuthors = document.querySelectorAll(selector);

    /* START LOOP: for each link */
    for(let linkAuthor of linksAuthors){

      /* add tagClickHandler as event listener for that link */
      linkAuthor.addEventListener('click',authorClickHandler);
    /* END LOOP: for each link */
    }
  }
  /* for authors in the articles */
  addClickListenersToAuthors('.post-author a');  
  /* for authors in the sidebar */
  addClickListenersToAuthors('.list.authors a');
}
