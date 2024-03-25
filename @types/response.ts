import {Array, Boolean, Literal, Index, Integer, Null, Object, type Static, String, Union} from '@sinclair/typebox'
export const routeAuthCallbackRes = Object({
  admin: Boolean(),
  nf_id: String(),
  nf_token: String(),
  zd_id: Integer(),
  zd_ord: Integer()
})
export const routeForumsTopicsRes = Array(Object({
  category_id: Integer(),
  has_accepted_answer: Boolean(),
  id: Integer(),
  reply_count: Integer(),
  title: String(),
  views: Integer()
}), {
  maxItems: 15
})
export const routeSystemStatusRes = Object({
  page: Object({
    url: String({
      format: 'uri'
    })
  }),
  status: Object({
    description: Union([
      Literal('All Systems Operational'),
      Literal('Major System Outage'),
      Literal('Minor Service Outage'),
      Literal('Partial System Outage'),
      Literal('Partially Degraded Service'),
      Literal('Service Under Maintenance')
    ]),
    indicator: Union([
      Literal('critical'),
      Literal('maintenance'),
      Literal('major'),
      Literal('minor'),
      Literal('none')
    ])
  })
})
export const routeTicketCommentsRes = Object({
  comments: Array(Object({
    attachments: Array(Object({
      content_url: String({
        format: 'uri'
      }),
      file_name: String(),
      id: Integer(),
      size: Integer()
    })),
    author_id: Integer(),
    created_at: String({
      format: 'date-time'
    }),
    html_body: String(),
    id: Integer(),
    public: Boolean()
  })),
  count: Integer({
    maximum: 100 * 100
  }),
  users: Array(Object({
    email: String({
      format: 'email'
    }),
    id: Integer(),
    name: String(),
    organization_id: Union([
      Integer(),
      Null()
    ]),
    photo: Union([
      Null(),
      Object({
        content_url: String({
          format: 'uri'
        })
      })
    ]),
    role: Union([
      Literal('admin'),
      Literal('agent'),
      Literal('end-user')
    ])
  }))
})
export const routeTicketsInfoRes = Object({
  followers: Index(routeTicketCommentsRes, Literal('users')),
  related: Array(Integer()),
  ticket: Object({
    created_at: String({
      format: 'date-time'
    }),
    follower_ids: Array(Integer()),
    followup_ids: Array(Integer()),
    id: Integer(),
    organization_id: Union([
      Null(),
      Integer()
    ]),
    requester_id: Integer(),
    status: Union([
      Literal('closed'),
      Literal('hold'),
      Literal('new'),
      Literal('open'),
      Literal('pending'),
      Literal('solved')
    ]),
    subject: String(),
    updated_at: String({
      format: 'date-time'
    })
  })
})
export const routeTicketListRes = Object({
  count: Index(routeTicketCommentsRes, ['count']),
  tickets: Array(Index(routeTicketsInfoRes, ['ticket']), {
    maxItems: 10
  })
})
export const routeUserInfoRes = Object({
  nf: Object({
    avatar_url: String({
      format: 'uri'
    }),
    email: String({
      format: 'email'
    }),
    full_name: String(),
    id: String(),
    support_priority: Union([
      Literal(0),
      Literal(2),
      Literal(4),
      Literal(5),
      Literal(9),
      Literal(10),
      Literal(100),
      Literal(102),
      Literal(999),
      Literal(1000),
      Literal(1003),
      Literal(10000),
      Literal(100000),
      Literal(100001)
    ])
  }),
  zd: Index(Index(routeTicketCommentsRes, Literal('users')), Integer())
})
export type TRouteForumsTopicsRes = Static<typeof routeForumsTopicsRes>
export type TRouteSystemStatusRes = Static<typeof routeSystemStatusRes>
export type TRouteTicketInfoRes = Static<typeof routeTicketsInfoRes>
export type TRouteTicketCommentsRes = Static<typeof routeTicketCommentsRes>
export type TRouteTicketListRes = Static<typeof routeTicketListRes>
export type TRouteUserInfoRes = Static<typeof routeUserInfoRes>