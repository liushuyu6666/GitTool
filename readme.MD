# Concepts
## Objects
1. `Independent Original Object`
   All objects under the `.git/objects/` folder that start with 1 byte hex.
2. `Pack Object`
   All objects nested in `.git/objects/pack/` folder that belong to `OBJ_BLOB`, `OBJ_TREE`, `OBJ_COMMIT`, `OBJ_TAG`, `OBJ_OFS_DELTA` and `OBJ_REF_DELTA`.
3. `Pack Original Object`
   All objects nested in `.git/objects/pack/` folder that belong to `OBJ_BLOB`, `OBJ_TREE`, `OBJ_COMMIT` and `OBJ_TAG`.
4. `Pack Delta Object`
   All objects nested in `.git/objects/pack/` folder that belong to `OBJ_OFS_DELTA` and `OBJ_REF_DELTA`.
5. `Original Object`
   `Original Object` comprises `Independent Original Object` and `Pack Original Object`.


# gitTestSimple test kit
This kit contains couple simple files for unit test.

## pack object

1. `5fec731b51ec842da6351423114d4bbee41e7aee`
   1. blob, hex: `3b18e512dba79e4c8300dd08aeb37f8e728b8dad`
        ```
        hello world
        ```

   2. tree, hex: `c3b8bb102afeca86037d5b5dd89ceeb0090eae9d`
   
        ```
        100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad	test.txt
        ```

   3. commit, hex: `c17358365df785db682260407606051b011eee88`
        ```
        tree c3b8bb102afeca86037d5b5dd89ceeb0090eae9d
        author ShuyuLiuFQ <ShuyuLiuFQ@foxquilt.com> 1668786849 -0500
        committer ShuyuLiuFQ <ShuyuLiuFQ@foxquilt.com> 1668786849 -0500

        first commit
        ```

## git object

### blob
1. `2129cac3bcef43797f755ba6105c32d4a3f1ace0`
   The content is:
   ```
   This is the second blob
   This is not the third line
   ```

2. `fffbf73fb93d922f351ee5b7311e1edb1c76b427`
   The content is:
   ```
   This is the first blob
   This is the second line
   ```

3. `00fea2f4d78299c796a53ecbd9b59938a97e6d67`
   The content is:
   ```
   This is the second blob
   This is not the fourth line
   we add one new line here
   ```

### tree
1. `326ae25c4e61cba56782e9e37a19d0bbcf9b694e`
   The content is:
   ```
   100644 blob 2129cac3bcef43797f755ba6105c32d4a3f1ace0	new.txt
   ```
   
2. `a5e8ef5f17e278727d3f18a309cba4be8f6ba2c8`
   The content is:
   ```
   040000 tree 326ae25c4e61cba56782e9e37a19d0bbcf9b694e	bak
   100644 blob fffbf73fb93d922f351ee5b7311e1edb1c76b427	test.txt
   ```

3. `cfa7f29b1f343be510053c499f717e0c23f4dba0`
   The content is:
   ```
   100644 blob 00fea2f4d78299c796a53ecbd9b59938a97e6d67	new.txt
   ```

4. `08c5082aa833173f6fe08a6ffaa05bf49322b6cd`
   The content is:
   ```
   040000 tree cfa7f29b1f343be510053c499f717e0c23f4dba0	bak
   100644 blob fffbf73fb93d922f351ee5b7311e1edb1c76b427	test.txt
   ```

### commit
1. `d44f8c06583e525e7885ec701c04a067e061bd94`
   The content is:
   ```
   tree a5e8ef5f17e278727d3f18a309cba4be8f6ba2c8
   author shuyu liu <liushuyu6666@gmail.com> 1668874023 -0500
   committer shuyu liu <liushuyu6666@gmail.com> 1668874023 -0500
   
   This is the first commit, with two files and one folder
   ```

2. `7c556ca93b467f8f8247acf522915f2f9e048eb5`
   The content is:
   ```
   tree 08c5082aa833173f6fe08a6ffaa05bf49322b6cd
   parent d44f8c06583e525e7885ec701c04a067e061bd94
   author shuyu liu <liushuyu6666@gmail.com> 1668893946 -0500
   committer shuyu liu <liushuyu6666@gmail.com> 1668893946 -0500
   
   This is the second commit
   ```






# gitTest test kit
This kit contains real git for unit test.

## pack object
### OBJ_REF_DELTA
hash: `49853f52f49c4edbb53c63f2492c6ece14e308da`

content:
```
040000 tree a1722cf672d5283ceee24e20e6bf2a7ecbe4bc9a	graphql
040000 tree 0181ecd75354b4824fff7f432b320a2e2c73b787	hubspot
040000 tree a10212ebee6ee96905a1f7804251a0d0409ee43e	mongodb
100644 blob 546ad2daf3eaac1c1f1f4417ae41492e56c79075	payment.test.ts
100644 blob 14cb881f222bbd01c094f775c66d3eb41933cfe8	payment.ts
100644 blob c35f424c0c286d42ff41b2f28475420a3cceee29	professionInfo.ts
040000 tree 0303e1b8546fa779e4573acfed6d9ad0f700c4e9	user
```



# GitObject kit
## GitObject Class and Interface
`GitObject` class works for three objects - `blob`, `tree` and `commit`. When creating a new `GitObject` class, the common static values will be populated first, but the `data` field will be undefined. At this point the type of the object is known. The `differentiating` method will inflate the body of the object and populate the `data` according to the type of the object.
There is no independent `blob`, `tree` or `commit` objects.
The static values include:
1. hash (string): 20 bytes hex SHA1.
2. prefix (string): The first 1 byte of the hash.
3. suffix (string): The last 19 bytes of the hash.
4. body (Buffer): The body of the object, keep deflated.
5. type (GitObjectType): the type of the object from the `header`.
6. size (number): The size of the file by bytes from the `header`.
7. data (undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData): Initialize as undefined, after running `differentiating` it can be `GitBlobObjectData`, `GitTreeObjectData` and `GitCommitObjectData`. **This might take too much memory, need to be optimized, like print to a file.**
The deflated value of `GitObject` is `${header}0x00${body}`:
1. The `header` is `${type}0x20${size}`. 
2. The `body` depends on the type.

### GitBlobObject & GitBlobObjectData Class
`GitBlobObjectData` will have one field.
1. content (string): the content of the file

### GitTreeObject & GitTreeObjectData Class
The deflated `GitTreeObject` is like this: `{tree}0x20${size}0x00${modeNumber}0x20${fileName}0x00${20bytesHex}${modeNumber}0x20${fileName}0x00${20bytesHex}${modeNumber}0x20${fileName}0x00${20bytesHex}`, if stratify it, we will see:
1. `{tree}0x20${size}` header.
2. `0x00` delimiter.
3. `${modeNumber}0x20${fileName}0x00${20bytesHex}`: first entry of the body.
4. `${modeNumber}0x20${fileName}0x00${20bytesHex}`: second entry of the body.
5. ...


`GitTreeObjectData` class will inflate the body and return `fileEntries`.
1. fileEntries (GitTreeObjectFileEntry[]): `fileEntries` records all entries under the tree object.

### GitCommitObject & GitCommitObjectData Class
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

## util functions
### gitObjectParse
Functions under this folder are used for parse the content.

### getGitObjectType
Transfer the string to `enum` type.





## TODO:
GitObject will be modified to meet the requirement for describing object info briefly. It needs to record the file path and offset index of the body data, (this structure can be compatible in both original object and pack object).
We need another GitOriginalObjectOpener to create gitObject for original objects. The input should be the path of the original object, and then it creates the GitObject.
We need PackFilePair (pack and idx) to create gitObject for pack objects.