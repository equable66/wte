package main

import (
	"errors"
	"net/http"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID           string    `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Avatar       string    `json:"avatar"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Topic struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"uniqueIndex;not null" json:"name"`
	Description string    `json:"description"`
	CreatorID   string    `gorm:"index;not null" json:"creatorId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Post struct {
	ID           string    `gorm:"primaryKey" json:"id"`
	TopicID      string    `gorm:"index;not null" json:"topicId"`
	AuthorID     string    `gorm:"index;not null" json:"authorId"`
	Title        string    `gorm:"not null" json:"title"`
	Content      string    `gorm:"type:text;not null" json:"content"`
	CommentCount int64     `gorm:"default:0" json:"commentCount"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Comment struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	PostID    string    `gorm:"index;not null" json:"postId"`
	AuthorID  string    `gorm:"index;not null" json:"authorId"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	ParentID  *string   `gorm:"index" json:"parentId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type AuthClaims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

type app struct {
	db        *gorm.DB
	jwtSecret []byte
}

func main() {
	db, err := gorm.Open(sqlite.Open("wte.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	if err := db.AutoMigrate(&User{}, &Topic{}, &Post{}, &Comment{}); err != nil {
		panic(err)
	}

	a := &app{db: db, jwtSecret: []byte(getEnv("JWT_SECRET", "wte-secret"))}
	a.seed()

	r := gin.Default()
	r.Use(cors.New(cors.Config{AllowOrigins: []string{"http://localhost:3000", "http://localhost:5173"}, AllowMethods: []string{"GET", "POST", "OPTIONS"}, AllowHeaders: []string{"Authorization", "Content-Type"}, MaxAge: 12 * time.Hour}))

	api := r.Group("/api")
	{
		api.POST("/auth/login", a.login)
		api.POST("/auth/register", a.register)
		api.GET("/auth/me", a.authRequired(), a.me)
		api.GET("/search", a.searchAll)
		api.GET("/posts/hot", a.getHotPosts)

		api.GET("/topics", a.getTopics)
		api.GET("/topics/:topicId", a.getTopic)
		api.POST("/topics", a.authRequired(), a.createTopic)

		api.GET("/topics/:topicId/posts", a.getTopicPosts)
		api.POST("/topics/:topicId/posts", a.authRequired(), a.createPost)

		api.GET("/posts/:postId", a.getPostDetail)
		api.PUT("/posts/:postId", a.authRequired(), a.updatePost)
		api.DELETE("/posts/:postId", a.authRequired(), a.deletePost)
		api.GET("/posts/:postId/comments", a.getComments)
		api.POST("/posts/:postId/comments", a.authRequired(), a.createComment)
		api.DELETE("/comments/:commentId", a.authRequired(), a.deleteComment)
	}

	r.Run(":8080")
}

func (a *app) seed() {
	var userCount int64
	a.db.Model(&User{}).Count(&userCount)
	if userCount == 0 {
		pwd, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		users := []User{
			{ID: uuid.NewString(), Username: "demo", Email: "demo@wte.local", PasswordHash: string(pwd), Avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=demo"},
			{ID: uuid.NewString(), Username: "alice", Email: "alice@wte.local", PasswordHash: string(pwd), Avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=alice"},
			{ID: uuid.NewString(), Username: "bob", Email: "bob@wte.local", PasswordHash: string(pwd), Avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=bob"},
		}
		for _, u := range users {
			a.db.Create(&u)
		}
	}

	var topicCount int64
	a.db.Model(&Topic{}).Count(&topicCount)
	if topicCount == 0 {
		var users []User
		a.db.Order("created_at asc").Find(&users)
		if len(users) == 0 {
			return
		}

		now := time.Now()
		topics := []Topic{
			{ID: uuid.NewString(), Name: "React", Description: "React 组件、状态管理与工程实践", CreatorID: users[0].ID, CreatedAt: now.Add(-96 * time.Hour), UpdatedAt: now.Add(-2 * time.Hour)},
			{ID: uuid.NewString(), Name: "Go", Description: "Go 后端、Gin、Gorm 与性能优化", CreatorID: users[1].ID, CreatedAt: now.Add(-80 * time.Hour), UpdatedAt: now.Add(-3 * time.Hour)},
			{ID: uuid.NewString(), Name: "求职面试", Description: "简历优化、面试经验与职场沟通", CreatorID: users[2].ID, CreatedAt: now.Add(-72 * time.Hour), UpdatedAt: now.Add(-1 * time.Hour)},
		}
		for _, t := range topics {
			a.db.Create(&t)
		}

		posts := []Post{
			{ID: uuid.NewString(), TopicID: topics[0].ID, AuthorID: users[0].ID, Title: "React 项目目录怎么分层？", Content: "最近在做一个社区项目，想把页面组件和业务逻辑分开，大家一般怎么组织目录？", CreatedAt: now.Add(-48 * time.Hour), UpdatedAt: now.Add(-48 * time.Hour)},
			{ID: uuid.NewString(), TopicID: topics[0].ID, AuthorID: users[1].ID, Title: "useEffect 依赖数组常见坑", Content: "依赖遗漏会导致闭包问题，依赖过多又会反复请求，欢迎分享经验。", CreatedAt: now.Add(-36 * time.Hour), UpdatedAt: now.Add(-36 * time.Hour)},
			{ID: uuid.NewString(), TopicID: topics[1].ID, AuthorID: users[1].ID, Title: "Gin 中间件统一错误处理", Content: "我把鉴权、日志、panic recover 都放在中间件里，想看看更优雅的写法。", CreatedAt: now.Add(-30 * time.Hour), UpdatedAt: now.Add(-30 * time.Hour)},
			{ID: uuid.NewString(), TopicID: topics[1].ID, AuthorID: users[2].ID, Title: "Gorm 查询优化示例", Content: "通过预加载和索引优化，列表接口耗时从 300ms 降到 60ms。", CreatedAt: now.Add(-24 * time.Hour), UpdatedAt: now.Add(-24 * time.Hour)},
			{ID: uuid.NewString(), TopicID: topics[2].ID, AuthorID: users[2].ID, Title: "前端面试项目怎么讲更有亮点？", Content: "从业务目标、技术难点、结果数据三个角度讲效果更好。", CreatedAt: now.Add(-18 * time.Hour), UpdatedAt: now.Add(-18 * time.Hour)},
			{ID: uuid.NewString(), TopicID: topics[2].ID, AuthorID: users[0].ID, Title: "校招简历一页够吗？", Content: "一页够用，重点突出项目影响和个人贡献。", CreatedAt: now.Add(-12 * time.Hour), UpdatedAt: now.Add(-12 * time.Hour)},
		}
		for _, p := range posts {
			a.db.Create(&p)
		}

		comments := []Comment{
			{ID: uuid.NewString(), PostID: posts[0].ID, AuthorID: users[1].ID, Content: "可以按 features 切分，每个模块内放 page/components/service。", CreatedAt: now.Add(-47 * time.Hour), UpdatedAt: now.Add(-47 * time.Hour)},
			{ID: uuid.NewString(), PostID: posts[0].ID, AuthorID: users[2].ID, Content: "如果团队多人协作，建议补一份目录约定文档。", CreatedAt: now.Add(-46 * time.Hour), UpdatedAt: now.Add(-46 * time.Hour)},
			{ID: uuid.NewString(), PostID: posts[2].ID, AuthorID: users[0].ID, Content: "统一 response 结构特别有必要，前端处理会简单很多。", CreatedAt: now.Add(-28 * time.Hour), UpdatedAt: now.Add(-28 * time.Hour)},
			{ID: uuid.NewString(), PostID: posts[4].ID, AuthorID: users[0].ID, Content: "我一般会先讲场景，再讲你怎么决策和取舍。", CreatedAt: now.Add(-16 * time.Hour), UpdatedAt: now.Add(-16 * time.Hour)},
			{ID: uuid.NewString(), PostID: posts[5].ID, AuthorID: users[1].ID, Content: "一页足够，重点是可量化成果。", CreatedAt: now.Add(-11 * time.Hour), UpdatedAt: now.Add(-11 * time.Hour)},
		}
		for _, cm := range comments {
			a.db.Create(&cm)
			a.db.Model(&Post{}).Where("id = ?", cm.PostID).Update("comment_count", gorm.Expr("comment_count + 1"))
		}
	}
}

func (a *app) login(c *gin.Context) {
	var req struct {
		Account  string `json:"account"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payload"})
		return
	}

	var user User
	err := a.db.Where("username = ? OR email = ?", req.Account, req.Account).First(&user).Error
	if err != nil || bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "账号或密码错误"})
		return
	}

	now := time.Now()
	claims := AuthClaims{UserID: user.ID, RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(now.Add(7 * 24 * time.Hour)), IssuedAt: jwt.NewNumericDate(now)}}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString(a.jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "token error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenStr, "user": user})
}

func (a *app) register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payload"})
		return
	}

	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Username == "" || len(req.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "用户名必填，密码至少6位"})
		return
	}
	if req.Email == "" {
		req.Email = req.Username + "@wte.local"
	}

	var existing User
	if err := a.db.Where("username = ? OR email = ?", req.Username, req.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "用户名或邮箱已存在"})
		return
	}

	pwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "password error"})
		return
	}

	user := User{
		ID:           uuid.NewString(),
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(pwd),
		Avatar:       "https://api.dicebear.com/8.x/thumbs/svg?seed=" + req.Username,
	}
	if err := a.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "注册失败，请检查用户名或邮箱"})
		return
	}

	now := time.Now()
	claims := AuthClaims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString(a.jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "token error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": tokenStr, "user": user})
}

func (a *app) me(c *gin.Context) {
	user := c.MustGet("user").(User)
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (a *app) getTopics(c *gin.Context) {
	type topicResp struct {
		Topic
		PostCount   int64      `json:"postCount"`
		LatestAt    *time.Time `json:"latestAt"`
		CreatorName string     `json:"creatorName"`
	}

	var topics []Topic
	keyword := strings.TrimSpace(c.Query("q"))
	query := a.db.Model(&Topic{})
	if keyword != "" {
		like := "%" + keyword + "%"
		query = query.Where("name LIKE ? OR description LIKE ?", like, like)
	}
	query.Order("updated_at desc").Find(&topics)

	res := make([]topicResp, 0, len(topics))
	for _, t := range topics {
		var count int64
		a.db.Model(&Post{}).Where("topic_id = ?", t.ID).Count(&count)

		var last Post
		lastErr := a.db.Where("topic_id = ?", t.ID).Order("created_at desc").First(&last).Error

		var creator User
		a.db.First(&creator, "id = ?", t.CreatorID)

		item := topicResp{Topic: t, PostCount: count, CreatorName: creator.Username}
		if lastErr == nil {
			item.LatestAt = &last.CreatedAt
		}
		res = append(res, item)
	}

	c.JSON(http.StatusOK, gin.H{"items": res})
}

func (a *app) searchAll(c *gin.Context) {
	keyword := strings.TrimSpace(c.Query("q"))
	if keyword == "" {
		c.JSON(http.StatusOK, gin.H{"topics": []Topic{}, "posts": []gin.H{}})
		return
	}
	like := "%" + keyword + "%"

	var topics []Topic
	a.db.Where("name LIKE ? OR description LIKE ?", like, like).Order("updated_at desc").Limit(8).Find(&topics)

	var posts []Post
	a.db.Where("title LIKE ? OR content LIKE ?", like, like).Order("created_at desc").Limit(12).Find(&posts)

	postRes := make([]gin.H, 0, len(posts))
	for _, p := range posts {
		var author User
		var topic Topic
		a.db.First(&author, "id = ?", p.AuthorID)
		a.db.First(&topic, "id = ?", p.TopicID)
		postRes = append(postRes, gin.H{
			"id":         p.ID,
			"title":      p.Title,
			"topicId":    p.TopicID,
			"topicName":  topic.Name,
			"authorName": author.Username,
			"createdAt":  p.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"topics": topics, "posts": postRes})
}

func (a *app) getHotPosts(c *gin.Context) {
	limit := 10
	var posts []Post
	a.db.Order("comment_count desc, created_at desc").Limit(limit).Find(&posts)

	res := make([]gin.H, 0, len(posts))
	for _, p := range posts {
		var author User
		var topic Topic
		a.db.First(&author, "id = ?", p.AuthorID)
		a.db.First(&topic, "id = ?", p.TopicID)
		res = append(res, gin.H{
			"id":           p.ID,
			"title":        p.Title,
			"topicId":      p.TopicID,
			"topicName":    topic.Name,
			"authorName":   author.Username,
			"commentCount": p.CommentCount,
			"createdAt":    p.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"items": res})
}

func (a *app) createTopic(c *gin.Context) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "话题名称不能为空"})
		return
	}
	user := c.MustGet("user").(User)
	topic := Topic{ID: uuid.NewString(), Name: strings.TrimSpace(req.Name), Description: strings.TrimSpace(req.Description), CreatorID: user.ID}
	if err := a.db.Create(&topic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "话题名称已存在"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"item": topic})
}

func (a *app) getTopic(c *gin.Context) {
	var topic Topic
	if err := a.db.First(&topic, "id = ?", c.Param("topicId")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "topic not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"item": topic})
}

func (a *app) getTopicPosts(c *gin.Context) {
	topicID := c.Param("topicId")
	sortBy := c.DefaultQuery("sort", "latest")

	var posts []Post
	if sortBy == "hot" {
		a.db.Where("topic_id = ?", topicID).Order("comment_count desc, created_at desc").Find(&posts)
	} else {
		a.db.Where("topic_id = ?", topicID).Order("created_at desc").Find(&posts)
	}

	type postResp struct {
		Post
		AuthorName string `json:"authorName"`
	}
	res := make([]postResp, 0, len(posts))
	for _, p := range posts {
		var author User
		a.db.First(&author, "id = ?", p.AuthorID)
		res = append(res, postResp{Post: p, AuthorName: author.Username})
	}
	c.JSON(http.StatusOK, gin.H{"items": res})
}

func (a *app) createPost(c *gin.Context) {
	topicID := c.Param("topicId")
	var topic Topic
	if err := a.db.First(&topic, "id = ?", topicID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "topic not found"})
		return
	}

	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Title) == "" || strings.TrimSpace(req.Content) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "标题和内容必填"})
		return
	}
	user := c.MustGet("user").(User)
	post := Post{ID: uuid.NewString(), TopicID: topicID, AuthorID: user.ID, Title: strings.TrimSpace(req.Title), Content: strings.TrimSpace(req.Content)}
	if err := a.db.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "创建帖子失败"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"item": post})
}

func (a *app) getPostDetail(c *gin.Context) {
	postID := c.Param("postId")
	var post Post
	if err := a.db.First(&post, "id = ?", postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "post not found"})
		return
	}

	var author User
	a.db.First(&author, "id = ?", post.AuthorID)
	var topic Topic
	a.db.First(&topic, "id = ?", post.TopicID)

	c.JSON(http.StatusOK, gin.H{"item": gin.H{"post": post, "authorName": author.Username, "topic": topic}})
}

func (a *app) getComments(c *gin.Context) {
	postID := c.Param("postId")
	var comments []Comment
	a.db.Where("post_id = ?", postID).Order("created_at asc").Find(&comments)

	type commentNode struct {
		Comment
		AuthorName string        `json:"authorName"`
		Replies    []commentNode `json:"replies"`
	}
	res := make([]commentNode, 0, len(comments))
	for _, cm := range comments {
		var author User
		a.db.First(&author, "id = ?", cm.AuthorID)
		res = append(res, commentNode{Comment: cm, AuthorName: author.Username, Replies: []commentNode{}})
	}

	nodeMap := make(map[string]*commentNode, len(res))
	for i := range res {
		nodeMap[res[i].ID] = &res[i]
	}

	roots := make([]*commentNode, 0)
	for i := range res {
		node := &res[i]
		if node.ParentID == nil || *node.ParentID == "" {
			roots = append(roots, node)
			continue
		}

		// Flatten to one reply layer: second-level and deeper replies are
		// all attached under the top-level root comment.
		rootID := *node.ParentID
		for {
			parent, ok := nodeMap[rootID]
			if !ok || parent.ParentID == nil || *parent.ParentID == "" {
				break
			}
			rootID = *parent.ParentID
		}

		root, ok := nodeMap[rootID]
		if !ok {
			roots = append(roots, node)
			continue
		}
		root.Replies = append(root.Replies, *node)
	}

	sort.SliceStable(roots, func(i, j int) bool {
		return roots[i].CreatedAt.After(roots[j].CreatedAt)
	})

	output := make([]commentNode, 0, len(roots))
	for _, root := range roots {
		output = append(output, *root)
	}

	c.JSON(http.StatusOK, gin.H{"items": output})
}

func (a *app) createComment(c *gin.Context) {
	postID := c.Param("postId")
	var post Post
	if err := a.db.First(&post, "id = ?", postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "post not found"})
		return
	}

	var req struct {
		Content  string  `json:"content"`
		ParentID *string `json:"parentId"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Content) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "评论内容不能为空"})
		return
	}

	if req.ParentID != nil && *req.ParentID != "" {
		var parent Comment
		if err := a.db.First(&parent, "id = ?", *req.ParentID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "父评论不存在"})
			return
		}
	}

	user := c.MustGet("user").(User)
	cm := Comment{ID: uuid.NewString(), PostID: postID, AuthorID: user.ID, Content: strings.TrimSpace(req.Content), ParentID: req.ParentID}
	if err := a.db.Create(&cm).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "评论失败"})
		return
	}
	a.db.Model(&Post{}).Where("id = ?", postID).Update("comment_count", gorm.Expr("comment_count + 1"))
	c.JSON(http.StatusCreated, gin.H{"item": cm})
}

func (a *app) updatePost(c *gin.Context) {
	postID := c.Param("postId")
	var post Post
	if err := a.db.First(&post, "id = ?", postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "post not found"})
		return
	}

	user := c.MustGet("user").(User)
	if user.ID != post.AuthorID {
		c.JSON(http.StatusForbidden, gin.H{"message": "只能修改自己发布的帖子"})
		return
	}

	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Title) == "" || strings.TrimSpace(req.Content) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "标题和内容必填"})
		return
	}

	post.Title = strings.TrimSpace(req.Title)
	post.Content = strings.TrimSpace(req.Content)
	if err := a.db.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "更新帖子失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"item": post})
}

func (a *app) deletePost(c *gin.Context) {
	postID := c.Param("postId")
	var post Post
	if err := a.db.First(&post, "id = ?", postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "post not found"})
		return
	}

	user := c.MustGet("user").(User)
	if user.ID != post.AuthorID {
		c.JSON(http.StatusForbidden, gin.H{"message": "只能删除自己发布的帖子"})
		return
	}

	if err := a.db.Where("post_id = ?", postID).Delete(&Comment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除评论失败"})
		return
	}
	if err := a.db.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除帖子失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "帖子已删除"})
}

func (a *app) deleteComment(c *gin.Context) {
	commentID := c.Param("commentId")
	var cm Comment
	if err := a.db.First(&cm, "id = ?", commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "comment not found"})
		return
	}

	user := c.MustGet("user").(User)
	if user.ID != cm.AuthorID {
		c.JSON(http.StatusForbidden, gin.H{"message": "只能删除自己的评论"})
		return
	}

	ids := []string{cm.ID}
	if cm.ParentID == nil || *cm.ParentID == "" {
		var replies []Comment
		a.db.Where("parent_id = ?", cm.ID).Find(&replies)
		for _, rep := range replies {
			ids = append(ids, rep.ID)
		}
	}

	if err := a.db.Where("id IN ?", ids).Delete(&Comment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除评论失败"})
		return
	}
	a.db.Model(&Post{}).Where("id = ?", cm.PostID).Update("comment_count", gorm.Expr("CASE WHEN comment_count >= ? THEN comment_count - ? ELSE 0 END", len(ids), len(ids)))
	c.JSON(http.StatusOK, gin.H{"message": "评论已删除"})
}

func (a *app) authRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
		if tokenStr == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "请先登录"})
			c.Abort()
			return
		}

		claims := &AuthClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return a.jwtSecret, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "登录已过期，请重新登录"})
			c.Abort()
			return
		}

		var user User
		if err := a.db.First(&user, "id = ?", claims.UserID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "用户不存在"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

func getEnv(key, fallback string) string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	return v
}

func wrapErr(msg string, err error) error {
	if err == nil {
		return nil
	}
	return errors.New(msg + ": " + err.Error())
}
