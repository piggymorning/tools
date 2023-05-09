const { transformListToLink, readLink, reverseLink, ListNode } = require('./tools')

const list1 = [1, 2,3,   1,]
const l1 = transformListToLink(list1)


var isPalindrome = function (head) {
	if (!head) {
		return head
	}
	let res = true
	let slow = head
	let fast = head
	let rightNode = null
	while (fast.next && fast.next.next) {
		slow = slow.next
		fast = fast.next.next
	}
	rightNode = slow.next
	reversedRightLink = reverseLink(rightNode)
	let curR = reversedRightLink
	let curL = head
	while(curR){
		if(curL.val !== curR.val){
			res = false
			break
		}
		curL = curL.next
		curR = curR.next
	}
	return res
};
console.log('result is:',isPalindrome(l1))

// readLink(isPalindrome(l1))


