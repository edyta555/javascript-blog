{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  };

  const opt = {
    ArticleSelector: '.post',
    TitleSelector: '.post-title',
    TitleListSelector: '.titles',
    ArticleTagsSelector: '.post-tags .list',
    ArticleAuthorSelector: '.post-author',
    CloudClassCount: 5,
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(opt.TitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);

    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;
      const linkHTMLArticleData = {id: articleId, title: articleTitle};
      const linkHTMLArticle = templates.articleLink(linkHTMLArticleData);

      html = html + linkHTMLArticle;

    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags){
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
    const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);
    return classNumber;
  }

  function generateTags(){
    let allTags = {};
    const articles = document.querySelectorAll(opt.ArticleSelector);
    for(let article of articles){
      const tagsWrapper = article.querySelector(opt.ArticleTagsSelector);
      tagsWrapper.innerHTML = '';
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for(let tag of articleTagsArray){
        const linkHTMLTagData = {id: tag};
        const linkHTMLTag = templates.tagLink(linkHTMLTagData);

        html = html + linkHTMLTag;
        if(!allTags.hasOwnProperty(tag)){ // eslint-disable-line no-prototype-builtins
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      tagsWrapper.innerHTML = html;
    }
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};

    for(let tag in allTags){
      /* add another tag object to the array */
      /* where className-the size of the link based on the frequency of links in the articles */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    /*create function using Handlebars.compile used for the template */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  }
  generateTags();

  function tagClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-','');
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    for(let activeTagLink of activeTagLinks){
      activeTagLink.classList.remove('active');
    }

    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    for(let tagLink of tagLinks){
      tagLink.classList.add('active');
    }
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(selector){
    const linksTag = document.querySelectorAll(selector);

    for (let linkTag of linksTag) {
      linkTag.addEventListener('click', tagClickHandler);
    }
  }
  addClickListenersToTags('.post-tags a');
  addClickListenersToTags('.list.tags a');

  function generateAuthors(){
    let allAuthors = {};
    const articles = document.querySelectorAll(opt.ArticleSelector);

    for(let article of articles){
      const authorWrapper = article.querySelector(opt.ArticleAuthorSelector);
      const articleAuthor = article.getAttribute('data-author');
      const linkHTMLAuthorData = {id: articleAuthor};
      const linkHTMLAuthor = templates.authorLink(linkHTMLAuthorData);

      if(!allAuthors.hasOwnProperty(articleAuthor)){ // eslint-disable-line no-prototype-builtins
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      authorWrapper.innerHTML = linkHTMLAuthor;
    }

    const allAuthorsData = {authors: []};
    const authorList = document.querySelector('.authors');
    const authorsParams = calculateTagsParams(allAuthors);

    for(let author in allAuthors){
      /* add another author object to the array */
      /* where className-the size of the link based on the frequency of links in the articles */
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorsParams)
      });
    }
    /*create function using Handlebars.compile used for the template */
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }
  generateAuthors();

  function authorClickHandler(event){
    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const author = href.replace('#author-','');

    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for(let activeAuthorLink of activeAuthorLinks){
      activeAuthorLink.classList.remove('active');
    }

    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    for(let authorLink of authorLinks){
      authorLink.classList.add('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(selector){
    /* find links to authors */
    const linksAuthors = document.querySelectorAll(selector);

    for(let linkAuthor of linksAuthors){
      linkAuthor.addEventListener('click',authorClickHandler);
    }
  }
  /* for authors in the articles */
  addClickListenersToAuthors('.post-author a');
  /* for authors in the sidebar */
  addClickListenersToAuthors('.list.authors a');
}
