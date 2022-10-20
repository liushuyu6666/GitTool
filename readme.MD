# gitTestSimple
## Object
### blob
hex: `3b18e512dba79e4c8300dd08aeb37f8e728b8dad`

```
hello world
```

### tree
hex: `c3b8bb102afeca86037d5b5dd89ceeb0090eae9d`

```
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad	test.txt
```


### commit
hex: `c17358365df785db682260407606051b011eee88`

```
tree c3b8bb102afeca86037d5b5dd89ceeb0090eae9d
author ShuyuLiuFQ <ShuyuLiuFQ@foxquilt.com> 1668786849 -0500
committer ShuyuLiuFQ <ShuyuLiuFQ@foxquilt.com> 1668786849 -0500

first commit
```

### pack
hex: `5fec731b51ec842da6351423114d4bbee41e7aee`
# Class and Interface
## GitObject Class and Interface
`GitObject` class will be a base class for other three objects - `blob`, `tree` and `commit`, `GitObject` class will store static values and avoid parse or decrypt the content of objects, just for saving space.
The static values include:
1. hash (string): 20 bytes hex SHA1
2. prefix (string): the first 1 byte of the hash
3. suffix (string): the last 19 bytes of the hash
4. type (enum): initialize as a `NonDiff`, after running `differentiating` it can be `Blob`, `Tree` and `Commit`.
5. size (number): initialize as 0, after running `differentiating` it can be populated.
6. data (enum): initialize as undefined, after running `differentiating` it can be `BlobData`, `TreeData` and `CommitData`. **This might take too much memory, need to be optimized**

There are some methods to touch the content:
1. differentiating: The raw content will first be decrypted via `inflate` algorithm and then split it into chunks. Then the `type` and `size` will be populated. ~~The chunks called `bufChunks` will be returned~~. Finally the `data` will be selected and filled.

## BlobData Interface
`BlobData` will have one field.
1. content (string): the content of the file

## TreeData Interface
`TreeData` will have one field.
1. fileEntries (FileEntry[]): `fileEntries` records all entries under the tree object.

## Commit Interface
There are couple fields.
1. treeHash (string): 20 bytes SHA1 hash of the root tree
2. parentHashes (string[]): parent commits hash
3. message (string): message for this commit
4. authorName (string)
5. authorEmail (string)
6. authorTimestamp (string)
7. authorTimezone (string)
8. committerName (string)
9. committerEmail (string)
10. committerTimestamp (string)
11. committerTimezone (string)
