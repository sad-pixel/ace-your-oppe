export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
}

export interface ProblemSet {
  id: string;
  title: string;
  description: string;
  problemCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
}

export const problemSets: ProblemSet[] = [
  {
    id: 'arrays-basics',
    title: 'Arrays & Strings',
    description: 'Master the fundamentals of array manipulation and string operations.',
    problemCount: 5,
    difficulty: 'Beginner',
    topics: ['Arrays', 'Strings', 'Loops'],
  },
  {
    id: 'sorting-searching',
    title: 'Sorting & Searching',
    description: 'Learn essential sorting algorithms and efficient search techniques.',
    problemCount: 4,
    difficulty: 'Intermediate',
    topics: ['Sorting', 'Binary Search', 'Algorithms'],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Tackle complex optimization problems with DP techniques.',
    problemCount: 3,
    difficulty: 'Advanced',
    topics: ['DP', 'Memoization', 'Optimization'],
  },
];

export const problems: Record<string, Problem[]> = {
  'arrays-basics': [
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
      starterCode: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass',
    },
    {
      id: 'reverse-string',
      title: 'Reverse String',
      difficulty: 'Easy',
      description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
      ],
      constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ASCII character.'],
      starterCode: 'def reverse_string(s: list[str]) -> None:\n    # Modify s in-place\n    pass',
    },
    {
      id: 'max-subarray',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
        { input: 'nums = [1]', output: '1' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
      starterCode: 'def max_subarray(nums: list[int]) -> int:\n    # Your code here\n    pass',
    },
    {
      id: 'contains-duplicate',
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
      starterCode: 'def contains_duplicate(nums: list[int]) -> bool:\n    # Your code here\n    pass',
    },
    {
      id: 'rotate-array',
      title: 'Rotate Array',
      difficulty: 'Medium',
      description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.',
      examples: [
        { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
        { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
      starterCode: 'def rotate(nums: list[int], k: int) -> None:\n    # Modify nums in-place\n    pass',
    },
  ],
  'sorting-searching': [
    {
      id: 'binary-search',
      title: 'Binary Search',
      difficulty: 'Easy',
      description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.',
      examples: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
        { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
      ],
      constraints: ['1 <= nums.length <= 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
      starterCode: 'def binary_search(nums: list[int], target: int) -> int:\n    # Your code here\n    pass',
    },
    {
      id: 'merge-sorted',
      title: 'Merge Sorted Array',
      difficulty: 'Easy',
      description: 'You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order. Merge `nums2` into `nums1` as one sorted array.',
      examples: [
        { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
      ],
      constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200'],
      starterCode: 'def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n    # Modify nums1 in-place\n    pass',
    },
    {
      id: 'sort-colors',
      title: 'Sort Colors',
      difficulty: 'Medium',
      description: 'Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.',
      examples: [
        { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
        { input: 'nums = [2,0,1]', output: '[0,1,2]' },
      ],
      constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
      starterCode: 'def sort_colors(nums: list[int]) -> None:\n    # Sort in-place\n    pass',
    },
    {
      id: 'search-rotated',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Hard',
      description: 'There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the rotated array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.',
      examples: [
        { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
        { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      ],
      constraints: ['1 <= nums.length <= 5000', 'All values of nums are unique.', 'nums is an ascending array that is possibly rotated.'],
      starterCode: 'def search(nums: list[int], target: int) -> int:\n    # Your code here\n    pass',
    },
  ],
  'dynamic-programming': [
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
      examples: [
        { input: 'n = 2', output: '2', explanation: 'There are two ways: 1+1 and 2.' },
        { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.' },
      ],
      constraints: ['1 <= n <= 45'],
      starterCode: 'def climb_stairs(n: int) -> int:\n    # Your code here\n    pass',
    },
    {
      id: 'coin-change',
      title: 'Coin Change',
      difficulty: 'Medium',
      description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.',
      examples: [
        { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
        { input: 'coins = [2], amount = 3', output: '-1' },
      ],
      constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
      starterCode: 'def coin_change(coins: list[int], amount: int) -> int:\n    # Your code here\n    pass',
    },
    {
      id: 'longest-increasing',
      title: 'Longest Increasing Subsequence',
      difficulty: 'Hard',
      description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
      examples: [
        { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101].' },
        { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      ],
      constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
      starterCode: 'def length_of_lis(nums: list[int]) -> int:\n    # Your code here\n    pass',
    },
  ],
};
