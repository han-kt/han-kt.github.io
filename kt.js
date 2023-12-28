// Generalized JavaScript to toggle elements (rows or list items)
document.addEventListener("DOMContentLoaded", function() {

	// Function to toggle elements (rows or list items) of a given container
	function toggleElements(containerId, showAllBtnId, hideBtnId, maxVisible) {
	  const container = document.getElementById(containerId);
	  const showAllBtn = document.getElementById(showAllBtnId);
	  const hideBtn = document.getElementById(hideBtnId);
	  const elements = container.tagName === 'TABLE' ? container.rows : container.children;
  
	  function showFirstElements() {
		Array.from(elements).forEach((elem, index) => {
		  if (index >= maxVisible) {
			elem.classList.add('hidden');
		  }
		});
		showAllBtn.classList.remove('hidden');
		hideBtn.classList.add('hidden');
	  }
  
	  function showAllElements() {
		Array.from(elements).forEach(elem => {
		  elem.classList.remove('hidden');
		});
		showAllBtn.classList.add('hidden');
		hideBtn.classList.remove('hidden');
	  }
  
	  showFirstElements();
  
	  showAllBtn.addEventListener("click", showAllElements);
	  hideBtn.addEventListener("click", showFirstElements);
	}
  
	// Initialize for Tables
	toggleElements("journalTable", "showAll_JT", "hide_JT", 7);
	toggleElements("conferenceTable", "showAll_CT", "hide_CT", 7);
	toggleElements("patentTable", "showAll_PT", "hide_PT", 7);
	toggleElements("newsList", "showAll_NL", "hide_NL", 7);
  });
