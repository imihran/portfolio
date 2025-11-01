nums = [5, -2, 7, -3,4]
prefix_sum =[]
prefix_sum.append(0)
cm=0


if nums is None: 
    print(prefix_sum)
for i in range(len(nums)):
    cm+=nums[i]
    prefix_sum.append(cm)

left = 1
right =4
print(prefix_sum)
print (prefix_sum[right] - prefix_sum[left])
