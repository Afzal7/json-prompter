// Background script
chrome.runtime.onInstalled.addListener(() => {
  console.log('JSON Prompter extension installed')
})

// Example: Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message from', sender)
  if (message.type === 'GET_DATA') {
    // Process the message and send a response
    sendResponse({ data: 'Response from background script' })
  }
  return true // Keep the message channel open for async response
})