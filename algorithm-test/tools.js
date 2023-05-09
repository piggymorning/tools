class ListNode {
    constructor(e) {
        this.val = e
        this.next = null
    }
}
function transformListToLink(list) {
    let head = new ListNode(list[0])
    let res = head
    for (let i = 1; i < list.length; i++) {
        head.next = new ListNode(list[i])
        head = head.next
    }
    return res
}

function readLink(link) {
    let res = ''
    let head = link
    while (head) {
        res = res + `${head.val}-->`
        head = head.next
    }
    console.log(`${res}null`)
}

function reverseLink(head) {
    if (!head) {
        return head
    }
    let dummyHead = new ListNode(-1)
    dummyHead.next = head
    let pre = head
    let cur = head.next
    while (cur) {
        const next = cur.next
        cur.next = dummyHead.next
        pre.next = next
        dummyHead.next = cur
        cur = next
    }
    return dummyHead.next
}

module.exports = {
    transformListToLink,
    readLink,
    ListNode,
    reverseLink
}